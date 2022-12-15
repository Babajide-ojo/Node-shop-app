import { Controller, Get, Post, Body, UsePipes, Logger, Param, ParseIntPipe, HttpCode, HttpStatus, Query, 
        NotFoundException, BadRequestException, Patch } from '@nestjs/common';
import { DispatchService } from './dispatch.service';
import { Dispatch } from './entities/dispatch.entity';
import { createDispatchSchema } from './schemas/create-dispatch.schema';
import { JoiValidationPipe } from '../pipes/joi-validation.pipe';
import { CreateDispatchDto } from './dto/create-dispatch.dto';
import { CreateSODispatchDto } from './dto/create-so-dispatch.dto';
import { Hub } from '../zonings/entities/hub.entity';
import { CommunicationsService } from '../communications/communications.service';
import { createDispatchLocationSchema } from './schemas/create-dispatch-location.schema';
import { DispatchLocationDto } from './dto/dispatch-location.dto';
import { ApiQuery } from '@nestjs/swagger';
import { MAX_PAGE_LIMIT, DEFAULT_PAGE_LIMIT, ACKNOWLEDGED, ALL_STATUS_ID, RETURN_STATUS_ID, STOPPED_STATUS_ID, RETURN_ONGOING, KONGA_NOW_ORDER_TYPE } from '../config/constants';
import { DataResultDto } from '../dto/data-result.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { updateDispatchStatusSchema } from './schemas/update-dispatch-status.schema';
import { UpdateDispatchStatusDto } from './dto/update-dispatch-status.dto';
import { CacheService } from '../communications/cache.service';
import { updateDispatchStatusSchemas } from "./schemas/update-dispatch-status.schemas";
import { ReassignDispatchDto } from './dto/reassign-dispatch.dto';
import { Dispatcher } from '../dispatchers/entities/dispatcher.entity';
import { reassignDispatchSchema } from './schemas/reassign-dispatch.schema';
import { NotificationTypes } from '../entities/status.enum';
import { Status } from '../entities/status.entity';
import config from '../config/config';

@Controller('/dispatches')
export class DispatchController {
    private logger = new Logger("DispatchController");
    
    constructor(
        private cacheService: CacheService, 
        private dispatchService: DispatchService, 
        private communicationsService: CommunicationsService
        ) {}

    @Get('dispatcher/:orderReference')
    async findDispatcher(@Param('orderReference')@Query() orderReference: string): Promise<DataResultDto> {
        const dispatcher: Dispatcher = await this.dispatchService.getDispatcher(orderReference);
        if (!dispatcher) throw new NotFoundException("No dispatcher found.");

        return {
            status: "success",
            message: `Dispatcher found for ${orderReference}.`,
            data: dispatcher
        };
    }

    @Get('all')
    async findAll(): Promise<DataResultDto> {
        const dispatches: Dispatch[] = await this.dispatchService.getAll();
        if (!dispatches || !dispatches.length) throw new NotFoundException("No dispatches found.");

        return {
            status: "success",
            message: `Dispatches found successfully"`,
            data: dispatches
        };
    }

    @Get('summary')
    async findSummary(@Query() { from, to , store }): Promise<DataResultDto> {
        if (!from) from = new Date().toISOString().split('T')[0];
        if (!to) to = new Date().toISOString().split('T')[0];
        
        var date_regex = /^(19|20)\d{2}\-(0[1-9]|1[0-2])\-(0[1-9]|1\d|2\d|3[01])$/;
        if (!(date_regex.test(from) && date_regex.test(to))) {
            throw new BadRequestException("Date not in format 'YYYY-MM-DD'");
        }

        const summary = await this.dispatchService.getSummaryByDate(new Date(from), new Date(to), store);
        return {
            status: "success",
            message: `Dispatches summary.`,
            data: summary
        };
    }
    
    @Get('summary/all')
    async findAllSummary(@Query() { store }): Promise<DataResultDto> {
       const summary = await this.dispatchService.getSummary(store);

        return {
            status: "success",
            message: `Dispatches summary.`,
            data: summary
        };
    }

    @Get()
    async index(@Query('page') page: number = 0, @Query('limit') limit: number = DEFAULT_PAGE_LIMIT, @Query('store') store?: string, @Query('from') from?: Date, @Query('to') to?: Date ): Promise<DataResultDto> {
        limit = limit > MAX_PAGE_LIMIT ? MAX_PAGE_LIMIT : limit;
    
        const pagination: Pagination<Dispatch> = await this.dispatchService.getDispatches({page, limit, route: '/dispatches'}, store, from,to);
        if (!(pagination && pagination.itemCount)) throw new NotFoundException("No dispatch found.");

        return {
            status: "success",
            message: `Dispatches found successfully.`,
            data: pagination
        };
    }

    @Get('/hub/:hubName')
    async findByHub(@Param('hubName')@Query()hubName: string): Promise<DataResultDto> {
        const dispatches: Dispatch[] = await this.dispatchService.getAll(await Hub.findOne({ name: hubName }));
        if (!(dispatches && dispatches.length)) throw new NotFoundException("No dispatches found.");
        return {
            status: "success",
            message: `${dispatches.length} dispatches found successfully.`,
            data: dispatches
        };
    }

    @Get('/id/:id')
    async findById(@Param('id', new ParseIntPipe())@Query()id: number): Promise<DataResultDto> {
        const dispatches: Dispatch[] = await Dispatch.findByIds([id]);
        if (!(dispatches && dispatches.length)) throw new NotFoundException("No dispatch record found.");

        return {
            status: "success",
            message: `Dispatches found successfully.`,
            data: (dispatches && dispatches.length)? dispatches[0]: null
        };
    }

    @Get('/order/:orderReference')
    async findByOrder(@Param('orderReference')@Query()orderReference: string): Promise<DataResultDto> {
        const dispatch: Dispatch = await Dispatch.findOne({ orderReference });
        if (!dispatch) throw new NotFoundException("No dispatch record found.");
        if(dispatch && dispatch.dispatcher) {
            delete dispatch.dispatcher.registrationToken;

            return {
                status: "success",
                message: `Dispatch found successfully.`,
                data: dispatch
            };
        }
    }

    @Get('/except/:orderReferences')
    @ApiQuery({ name: "orderReferences", description: `Comma separated list of order References.`})
    async findExcept(@Param('orderReferences')@Query()orderReferences: string): Promise<DataResultDto> {
        const identity: string = config.user.phone;
        if (!identity) throw new NotFoundException("No dispatcher record found.");

        const dispatches: Dispatch[] = await this.dispatchService.getActiveExcept(identity, orderReferences);

        return {
            status: "success",
            message: `${dispatches.length} ongoing dispatches found for dispatcher ${identity}.`,
            data: dispatches
        };
    }

    @Get('/ids/:ids')
    @ApiQuery({ name: "ids", description: `Comma separated list of ids. Maximum of ${MAX_PAGE_LIMIT}`})
    async findByIds(@Param('ids')@Query()ids: string): Promise<DataResultDto> {
        const dispatches: {id: string, statusCode: number, dispatch: Dispatch}[] = [];
        let gotRecord = false;
        const idStrs = ids.split(',');

        if(idStrs.length > MAX_PAGE_LIMIT)
            throw new BadRequestException(`Ids more than maximum of ${MAX_PAGE_LIMIT}.`)

        for (let idStr of idStrs) {
            idStr = idStr.trim();
            const id: number = Number(idStr);

            let statusCode: number = 400;
            let dispatch: Dispatch = null;
            if (!isNaN(id)) {
                dispatch = await Dispatch.findOne({id});
                if (dispatch) {
                    gotRecord = true;
                    delete dispatch.dispatcher.registrationToken;
                    statusCode = 200;
                } else
                    statusCode = 404;
            }
            dispatches.push({id:idStr, statusCode, dispatch});
        }

        if (!gotRecord) throw new NotFoundException("No dispatches record found.");
        return {
            status: "success",
            message: `${dispatches.length} records found for dispatches.`,
            data: dispatches
        };
    }

    // @Post()
    // @HttpCode(HttpStatus.ACCEPTED)
    // @UsePipes(new JoiValidationPipe(createDispatchSchema))
    // async createDispatch(@Body() createDispatchDto: CreateDispatchDto): Promise<DataResultDto> {
    //     const [dispatch, dispatchers] : [Dispatch, Dispatcher[]] = await this.dispatchService.createDispatch(createDispatchDto)
    //         .catch(error => {
    //             this.logger.error(`The following error occured while creating dispach for order "${createDispatchDto.orderReference}"`, JSON.stringify(error));
    //             throw new BadRequestException(`Please check the data and try again. "${error}"`);
    //         });

    //     if (dispatchers && dispatchers.length){
    //         // send order to all eligigble dispatchers
    //         await this.communicationsService.notifyDispatchers(dispatch, dispatchers);
    //     } else {
    //         this.cacheService.queue(dispatch);
    //     }

    //     return {
    //         status: "success",
    //         message: `Dispatch for order ${createDispatchDto.orderReference} is processing.`,
    //         data: dispatch
    //     };
    // }

    @Post('/so')
    @HttpCode(HttpStatus.ACCEPTED)
    async createSoDispatch(@Body() createSODispatchDto: CreateSODispatchDto): Promise<DataResultDto> {
        const createDispatchDto = await this.dispatchService.createDispatchDto(createSODispatchDto);
        if(!createDispatchDto){
            throw new NotFoundException("Order not found");
        }
        const [dispatch] : [Dispatch] = await this.dispatchService.createDispatch(createDispatchDto, KONGA_NOW_ORDER_TYPE)
            .catch(error => {
                this.logger.error(`The following error occured while creating dispach for order "${createDispatchDto.orderReference}"`, JSON.stringify(error));
                throw new BadRequestException(`Please check the data and try again. "${error}"`);
            });

            if(dispatch){
                await this.communicationsService.notifyStore(createSODispatchDto);
            } else{
                this.cacheService.queue(dispatch);
            }
        // if (dispatchers && dispatchers.length){
        //     // send order to all eligigble dispatchers
        //     await this.communicationsService.notifyDispatchers(dispatch, dispatchers);
        // } else {
        //     this.cacheService.queue(dispatch);
        // }

        return {
            status: "success",
            message: `Dispatch for order ${createSODispatchDto.orderNumber} is processing.`,
            data: dispatch
        };
    }

    @Get('/resend/order/:orderReference')
    @HttpCode(HttpStatus.NON_AUTHORITATIVE_INFORMATION)
    async resendOrder(@Param('orderReference')@Query()orderReference: string): Promise<DataResultDto> {
        const dispatch: Dispatch = await Dispatch.findOne({ orderReference });
        if (!dispatch) throw new NotFoundException(`Unknown Dispatch ${orderReference}.`);

        let dispatchers: Dispatcher[];
        
        if (dispatch.dispatcher) {
            if(dispatch.hub && dispatch.dispatcher.hub && dispatch.hub.id === dispatch.dispatcher.hub.id && dispatch.dispatcher.registrationToken)
                dispatchers = [dispatch.dispatcher];
            else if (!dispatch.dispatcher.registrationToken)
                throw new BadRequestException(`Can't send dispatch to rider (${dispatch.dispatcher.name}), rider not reacheable.`);
            else throw new BadRequestException(`Can't send dispatch (in hub ${dispatch.hub.name}) to rider in different hub (${dispatch.dispatcher.hub.name}).`);
        } else {
            dispatchers = await this.dispatchService.getAllDispatchers(dispatch);
        }
                    
        if (!dispatchers || !dispatchers.length) throw new NotFoundException(`No eligible dispatchers found for Dispatch ${orderReference}.`);
        
        this.logger.log(`Sending dispatch ${orderReference} to ${dispatchers.length} dispatcher${(dispatchers.length > 1)? 's':''}`);
        await this.communicationsService.notifyDispatchers(dispatch, dispatchers);

        return {
            status: "success",
            message: `Broadcast${(dispatch)? " sent successfully": " not sent, try agian"}.`,
            data: dispatch
        };
    }

    @Patch('/stop/order/:orderReference')
    @HttpCode(HttpStatus.NON_AUTHORITATIVE_INFORMATION)
    async stopOrder(@Param('orderReference')@Query()orderReference: string): Promise<DataResultDto> {
        const dispatch: Dispatch = await Dispatch.findOne({ orderReference });
        if (!dispatch) throw new BadRequestException(`Unknown Dispatch ${orderReference}.`);

        dispatch.statusId = STOPPED_STATUS_ID;
        dispatch.status = await Status.findOne({id:STOPPED_STATUS_ID});
        if (!(await dispatch.save())) throw new BadRequestException("Unable to stop delivery, please try again.");
        const dispatchers: Dispatcher[] = (dispatch.dispatcher && dispatch.dispatcher.registrationToken && dispatch.hub.id == dispatch.dispatcher.hub.id)? 
            [dispatch.dispatcher]: await this.dispatchService.getAllDispatchers(dispatch);
        
        let state = true;            
        if (dispatchers && dispatchers.length) state = await this.communicationsService.notifyDispatchers(dispatch, dispatchers, NotificationTypes.STOPPED);
        state = state && (await this.dispatchService.updateMercuryStatus(dispatch.orderReference, RETURN_STATUS_ID, RETURN_ONGOING));

        if (!state) throw new BadRequestException("Incomplete stopage, please contact CET.");

        return {
            status: "success",
            message: `Delivery successfully stopped.`,
            data: dispatch
        };
    }

    @Post('/location')
    @HttpCode(HttpStatus.ACCEPTED)
    @UsePipes(new JoiValidationPipe(createDispatchLocationSchema))
    async createDispatchLocation(@Body() dispatchLocationDto: DispatchLocationDto): Promise<DataResultDto> {
        return {
            status: "success",
            message: `Dispatch location received and it's been processed.`,
            data: await this.communicationsService.setDispatchLocation(dispatchLocationDto)
        };
    }

    @Patch('/status')
    @UsePipes(new JoiValidationPipe(updateDispatchStatusSchema))
    async updateDispatchStatus(@Body() payload: UpdateDispatchStatusDto): Promise<DataResultDto> {
        const { reference, dispatcherIdentity, status, time } = payload;
        const dispatch = await this.dispatchService.updateStatus(reference, dispatcherIdentity, status, time);

        if (dispatch) {
            if (dispatch.status.name == ACKNOWLEDGED) {
                this.logger.log(`Dispatch ${JSON.stringify(dispatch)} ${ACKNOWLEDGED} by ${dispatch.dispatcher.identity}`)
                // ask other to drop order
                const dispatchers: Dispatcher[] = (await this.dispatchService.getAllDispatchers(dispatch, ALL_STATUS_ID))
                                                    .filter(dispatcher => dispatcher.identity != dispatcherIdentity);

                this.communicationsService.notifyDispatchers(dispatch, dispatchers, NotificationTypes.UNAVAILABLE);
            }
            
            this.logger.log(`Status update for "${ dispatch.orderReference }" to "${ status }" by: "${ dispatcherIdentity }"`);
            return {
                status: "success",
                message: `Status updated successfully.`,
                data: null
            };
        }
        throw new NotFoundException(`Status NOT updated for ${reference}.`);
    }

    @Patch('/statuses')
    @HttpCode(HttpStatus.ACCEPTED)
    @ApiQuery({ name: "UpdateDispatchStatusDto Array", type: [UpdateDispatchStatusDto]})
    @UsePipes(new JoiValidationPipe(updateDispatchStatusSchemas))
    async updateDispatchStatuses(@Body() payloads: UpdateDispatchStatusDto[]): Promise<DataResultDto> {
        for (const payload of payloads) {
            const { reference, dispatcherIdentity, status, time } = payload;
            const dispatch = await this.dispatchService.updateStatus(reference, dispatcherIdentity, status, time);
            if (dispatch)
                this.logger.log(`Status update for '${ JSON.stringify(payload) }' is successful`);
            else
                this.logger.log(`Status update for '${ JSON.stringify(payload) }' failed.`);
        }

        return {
            status: "success",
            message: `Dispatch status update is processing...`,
            data: null
        };
    }

    @Patch('/assign')
    async assignDispatch(@Body() reference: string): Promise<DataResultDto> {
        const dispatch = await this.dispatchService.autoAssignDispatch(reference);

        if (dispatch) {
            this.logger.log(`Assignment made: assigned "${ dispatch.orderReference }" to "${ dispatch.dispatcher.identity }"`);
            return {
                status: "success",
                message: `Assignment made successfully.`,
                data: null
            };
        }
        throw new NotFoundException(`Status NOT updated for ${reference}.`);
    }

    @Patch('/reassign')
    @UsePipes(new JoiValidationPipe(reassignDispatchSchema))
    async reassignDispatch(@Body() payload: ReassignDispatchDto): Promise<DataResultDto> {
        const { reference, newDispatcherIdentity } = payload;
        const [dispatch, oldDispatcher, message] = await this.dispatchService.reassignDispatch(reference, newDispatcherIdentity);

        if (dispatch && dispatch.dispatcher) {
            const status = await this.communicationsService.notifyDispatchers(dispatch, [dispatch.dispatcher]);
            this.logger.log(`Re-assignment for order ${reference} made successfully for "${ dispatch.orderReference }" to "${ newDispatcherIdentity }"`);
            await this.communicationsService.notifyDispatchers(dispatch, [oldDispatcher], NotificationTypes.UNAVAILABLE); // sent reassigned notification.
            return {
                status: "success",
                message: `Re-assignment made successfully.`,
                data: status
            };
        }
        this.logger.log(`Re-assignment attepmt for ${reference} not successful. ${message}.`);
        throw new NotFoundException(`${message}.`);
    }
}