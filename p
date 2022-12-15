import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { Dispatch } from './entities/dispatch.entity';
import { CreateDispatchDto } from './dto/create-dispatch.dto';
import { Dispatcher } from '../dispatchers/entities/dispatcher.entity';
import { Hub } from '../zonings/entities/hub.entity';
import { READY_FOR_PICKUP, ASSIGNED, UNASSIGNED_STATUS_ID, READY, READY_STATUS_ID, ALL_STATUS_ID, RETURN_ONGOING_MESSAGE, NEW, MERCURY_DELIVERED, KONGA_NOW_ORDER_TYPE, MERCURY_DELIVERED_ID, MERCURY_OUT_FOR_DELIVERY, MERCURY_OUT_FOR_DELIVERY_ID } from '../config/constants';
import { Status } from '../entities/status.entity';
import { DispatcherService } from '../dispatchers/dispatcher.service';
import { ZoningService } from '../zonings/zoning.service';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { getRepository, IsNull, Not } from 'typeorm';
import { DispatchLog } from "./entities/dispatch-log.entity";
import { DispatchAssignmentLog } from './entities/dispatch-assignment-log.entity';
import { OrdersService } from '../orders/orders.service';
import config from '../config/config';
import fetch from "node-fetch";
import { CreateSODispatchDto } from './dto/create-so-dispatch.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { HubRepository } from '../zonings/hub.repository';

@Injectable()
export class DispatchService {
  private logger = new Logger("DispatchService");
  
  constructor(
    private dispatcherService: DispatcherService, 
    private zoningService: ZoningService,
    private ordersService: OrdersService,
    @InjectRepository(HubRepository) private hubRepository: HubRepository
  ) {}

  async createDispatch(createDispatchDto: CreateDispatchDto, orderType?:string): Promise<[Dispatch]> {
    // const hub: Hub = await this.zoningService.getArea(createDispatchDto.customerDetails.area)
    //   .then((area)=> { return area.hub; } );
    const hub: Hub = await this.hubRepository.getHub(createDispatchDto.merchantDetails.name)

    // if (!hub){
    //   throw new BadRequestException (`Dispatcher cannot be allocated to ${createDispatchDto.customerDetails.area}`);
    // }

    //const dispatchers: Dispatcher[] = await this.dispatcherService.findBestDispatchers(hub);

    const dispatch: Dispatch = new Dispatch();

    dispatch.orderReference = createDispatchDto.orderReference;
    dispatch.description = createDispatchDto.description;
    dispatch.estimatedPickupTime = createDispatchDto.estimatedPickupTime;
    dispatch.estimatedDeliveryTime = createDispatchDto.estimatedDeliveryTime;
    dispatch.callbackReferenceKey = createDispatchDto.callbackReferenceKey;
    dispatch.deliveryMode = createDispatchDto.deliveryMode;
    if(orderType){
      dispatch.orderType = orderType
    }

    dispatch.merchantName = createDispatchDto.merchantDetails.name;
    dispatch.merchantPhone = createDispatchDto.merchantDetails.phone;
    dispatch.pickupArea = createDispatchDto.merchantDetails.area;
    dispatch.pickupAddress = createDispatchDto.merchantDetails.address;
    dispatch.amount = createDispatchDto.amount;
    dispatch.amountDue = createDispatchDto.amountDue;
    dispatch.pickupPointLatitude = createDispatchDto.merchantDetails.latitude;
    dispatch.pickupPointLongitude = createDispatchDto.merchantDetails.longitude;
       
    dispatch.customerName = createDispatchDto.customerDetails.name;
    dispatch.customerPhone = createDispatchDto.customerDetails.phone;
    dispatch.deliveryArea = createDispatchDto.customerDetails.area;
    dispatch.deliveryAddress = createDispatchDto.customerDetails.address;
    dispatch.deliveryNote = createDispatchDto.deliveryNote;     
    dispatch.deliveryPointLatitude = createDispatchDto.customerDetails.latitude;
    dispatch.deliveryPointLongitude = createDispatchDto.customerDetails.longitude;
   
    dispatch.statusId = NEW;
    dispatch.hub = hub;

    return [await dispatch.save()];
  }

  // confirm if it mine && send as no fensing
  async getDispatcher(orderReference: string): Promise<Dispatcher> {
    const dispatch = await Dispatch.findOne({ orderReference });

    if (dispatch && dispatch.dispatcher) {
      const dispatcher: Dispatcher = dispatch? dispatch.dispatcher: null;
      
      delete dispatcher.id;
      delete dispatcher.registrationToken;
      delete dispatcher.hub;
      delete dispatcher.createdAt;
      delete dispatcher.updatedAt;
      delete dispatcher.statusId;

      return dispatcher;
    }

    return;
  }

  async getActiveExcept(identity: string, orderReferences: string): Promise<Dispatch[]> {
    orderReferences = `'${orderReferences.replace(",", "','")}'`;
    const ongoingDispatches: any = await getRepository(Dispatch)
                            .createQueryBuilder("d")
                            .leftJoinAndSelect("statuses", "s", "d.statusId = s.id")
                            .leftJoinAndSelect("dispatchers", "ds", "d.hubId = ds.hubId")
                            .select("d.*, s.id status_id, s.name status_name, s.description status_description" )
                            .where('dispatcherIdentity = :id', { id: identity })
                            .andWhere(`s.isTerminal = 0`)
                            .andWhere(`d.orderReference NOT IN (:orderReferences)`, { orderReferences })
                            .getRawMany();

    return ongoingDispatches;
  }

  async getAll(hub?: Hub, assigned?: boolean): Promise<Dispatch[]> {
    const statusName: string = assigned? ASSIGNED : READY_FOR_PICKUP;
    const status = await Status.findOne({name: statusName});
    const statusId: number = status? status.id : 0;
    if (hub && assigned) {
      return Dispatch.find({ hub, statusId });
    }
    if (hub && !assigned) {
      return Dispatch.find({ hub });
    }
    if (assigned && !hub) {
      return Dispatch.find({ hub });
    }
    return Dispatch.find();
  }

  async getAllDispatchers(dispatch: Dispatch, dispatcherStatusId: number = READY_STATUS_ID): Promise<Dispatcher[]> {
    if (dispatcherStatusId == ALL_STATUS_ID)
      return await Dispatcher.find({ hub: dispatch.hub, registrationToken: Not(IsNull()) });
    return await Dispatcher.find({ hub: dispatch.hub, statusId: dispatcherStatusId, registrationToken: Not(IsNull()) });
  }

  async getSummaryByDate(from: Date, to: Date, store): Promise<any> {

    const _from = `${from.toISOString().split('T')[0]}`;
    const _to = `${to.toISOString().split('T')[0]} 23:59:59`;
    let hubID;
    if (store) {
      hubID = (await this.hubRepository.getHubByID(store)).id
    }
    const summary = await getRepository(Dispatch)
      .createQueryBuilder("d")
      .leftJoinAndSelect("statuses", "s", "d.statusId = s.id")
      .select("d.statusId, s.name AS status, COUNT(d.statusId) AS count, s.description, SUM(amount) as Revenue")
      .groupBy("d.statusId")
      .andWhere(`d.createdAt BETWEEN '${_from}' AND '${_to}'`)
      .andWhere(hubID ? `d.hubid = ${hubID}` : [])
      .getRawMany();
    return summary;
  }


  async getSummary(store): Promise<any> {
    let hubID;
    if (store) {
      hubID = (await this.hubRepository.getHubByID(store)).id
    }

    const summary = await getRepository(Dispatch)
      .createQueryBuilder("d")
      .leftJoinAndSelect("statuses", "s", "d.statusId = s.id")
      .select("d.statusId, s.name AS status, COUNT(d.statusId) AS count, s.description, SUM(amount) as Revenue")
      .groupBy("d.statusId")
      .andWhere(hubID ? `d.hubid = ${hubID}` : [])
      .getRawMany();
    return summary;
  }

  async autoAssignDispatch(reference: string): Promise<Dispatch> {
    const dispatch: Dispatch = await Dispatch.findOne({ orderReference: reference });
    const oldDispatcher: Dispatcher = dispatch.dispatcher;
    const dispatcher: Dispatcher = await this.dispatcherService.assignToBestDispatcher(dispatch);

    const remark: string = dispatch.dispatcher ? `Reassigned from ${oldDispatcher.identity} to ${dispatcher.identity}`: `Assigned to ${dispatcher.identity}`;
    const dispatchAssignmentLog = new DispatchAssignmentLog();
    dispatchAssignmentLog.orderReference = reference;
    dispatchAssignmentLog.dispatcherId = dispatcher.identity;
    dispatch.dispatcher = dispatcher;

    if(dispatcher && await dispatch.save()) {
      dispatchAssignmentLog.remark = remark;
      await dispatchAssignmentLog.save();

      return dispatch;
    } else {
      dispatchAssignmentLog.remark = `Failed: - ${remark}`;
      await dispatchAssignmentLog.save();
      
      return null;
    }
  }

  async reassignDispatch(reference: string, newDispacher: string): Promise<[Dispatch, Dispatcher, string]> {
    const dispatch: Dispatch = await Dispatch.findOne({ orderReference: reference });
    if(!dispatch) return [null, null, 'Unknown order'];
    const dispatcher: Dispatcher = await Dispatcher.findOne({ identity: newDispacher });
    if(dispatch.dispatcher && dispatch.dispatcher.identity == newDispacher) return [null, null, 'Cannot re-assign to same dispatcher'];

    let oldDispatcher = dispatch.dispatcher;
    if(!oldDispatcher){
     oldDispatcher = dispatcher;
    } 
    const remark: string = dispatch.dispatcher ? `Reassigned from ${dispatch.dispatcher.identity} to ${newDispacher}`: `Assigned to ${newDispacher}`;
    const dispatchAssignmentLog = new DispatchAssignmentLog();
    dispatchAssignmentLog.orderReference = reference;
    dispatchAssignmentLog.dispatcherId = newDispacher;
    dispatch.dispatcher = dispatcher;

    if(dispatcher && await dispatch.save()) {
      dispatchAssignmentLog.remark = remark;
      await dispatchAssignmentLog.save();

      return [dispatch, oldDispatcher, remark];
    } else {
      dispatchAssignmentLog.remark = `Failed: - ${remark}`;
      await dispatchAssignmentLog.save();
      
      return [null, oldDispatcher, dispatchAssignmentLog.remark];
    }
  }



  async getDispatches(options: IPaginationOptions, store?, from?: Date, to?: Date): Promise<Pagination<Dispatch>> {
    const queryBuilder = getRepository(Dispatch).createQueryBuilder("d");
    queryBuilder.leftJoinAndSelect("d.status", "status")
    let hubID;
    if (from) {
      const _from = from ? from : `${new Date().toISOString().split('T')[0]}`;
      const _to = to ? to + ' 23:59:59' : `${new Date().toISOString().split('T')[0]} 23:59:59`;
      queryBuilder.where(`d.createdAt BETWEEN '${_from}' AND '${_to}'`);
    }

    if (store) {
      hubID =  (await this.hubRepository.getHubByID(store)).id

      queryBuilder.andWhere(`d.hubid = ${hubID}`)
    }
    return paginate<Dispatch>(queryBuilder, options);
  }

  async updateMercuryStatus(reference: string, status: number, action:string): Promise<boolean> {
    const url = `${config.web.apiUrl}/v3/waybills/update-instant-shipping-waybill?${config.accessToken}`;
    const message = `updated to ${status} by ${config.user.full_name} (${config.user.email || config.user.phone})`;
    const logger = this.logger;
    try {
      const body = {payload:{
        status,
        waybill_number: reference,
        message,
        action,
        packageTrack: {
          comments: message
        }
      }};
      logger.log(body);
      return fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" }
      })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        logger.log(data);
        return (data && data.message === RETURN_ONGOING_MESSAGE);
      });
    } catch (e) {
      logger.error(e);
      throw new BadRequestException(e);
    }    
  }

  async updateStatus(reference: string, dispatcherId: string, status: string, time: string): Promise<Dispatch> {
    const dispatch: Dispatch = await Dispatch.findOne({ orderReference: reference });
    const dispatcher: Dispatcher = await Dispatcher.findOne({ identity: dispatcherId });
    if (dispatch) {
      if (dispatch.dispatcher && dispatch.dispatcher.identity != dispatcherId) {
        this.logger.log(`Failed attempt to update dispatch ${JSON.stringify(dispatch)} by ${dispatcherId}`)
        throw new BadRequestException(`Cannot update waybill. Please check that the waybill is assigned to ${dispatcherId}.`);
      } else if (!dispatch.dispatcher) {
        dispatch.dispatcher = dispatcher;
      }

      if (dispatch.status && dispatch.status.isTerminal) {
        this.logger.log(`Failed attempt to update terminal dispatch ${JSON.stringify(dispatch)}`)
        throw new BadRequestException("Cannot update waybills in terminal status.");
      }
      if (!dispatcher) {
        this.logger.log(`Failed attempt to update dispatch ${JSON.stringify(dispatch)}`)
        throw new BadRequestException(`Cannot update waybills by UNKNOWN dispatcher: ${dispatcherId}.`);
      }
  
      const name = status.toLowerCase();
      const statusObject: Status = await Status.findOne( { name } )
      if (!statusObject) {
        this.logger.log(`Failed attempt to update dispatch ${JSON.stringify(dispatch)}`)
        throw new BadRequestException(`Cannot update waybills to an UNKNOWN (${status}) status.`);
      }

      if (statusObject.name == dispatch.status.name) {
        this.logger.log(`Unneccessary attempt to update dispatch ${dispatch.orderReference} to ${statusObject.name} by ${dispatcherId}.`)
        return dispatch;
      }

      dispatch.status = statusObject;

      if (await dispatch.save()) {
        const action = status == MERCURY_DELIVERED ? MERCURY_DELIVERED: MERCURY_OUT_FOR_DELIVERY;
        const orderUpdate = action == MERCURY_DELIVERED? MERCURY_DELIVERED_ID: MERCURY_OUT_FOR_DELIVERY_ID;
        if(dispatch.orderType == KONGA_NOW_ORDER_TYPE){
          this.updateMercuryStatus(reference, orderUpdate, action)
        }
        const dispatchLog: DispatchLog = new DispatchLog();
        dispatchLog.dispatcherId = dispatcherId;
        dispatchLog.orderReference = reference;
        dispatchLog.status = name;
        dispatchLog.reportedTime = time;

        await dispatchLog.save();
      }
    } else {
      this.logger.log(`Failed attempt to update UNKNOWN dispatch with reference: ${reference} by ${dispatcherId}`)
      throw new NotFoundException(`Cannot find waybills with reference: ${reference}.`);
    }

    return dispatch;
  }

  async createDispatchDto(createSODispatchDto: CreateSODispatchDto){
   const { orderNumber, LocationId, SOM} = createSODispatchDto;
   this.logger.log(`Creating a dispatch For SOM ${SOM} and order Number ${orderNumber}`)
    try {
      let result = await this.ordersService.getOrderDetails(orderNumber);
      let orderDetails = result.data.getOrderDetails;
        if(!orderDetails.store_id){
          return null;
        }
     
      let area = await this.hubRepository.getHubByID( LocationId );
      
      let payment = orderDetails.payment.method == "cashondelivery" ? orderDetails.payment.amount_ordered : 0;
 
      let dispatchPayload: CreateDispatchDto = {
        "orderReference": orderNumber,
        "description": "",
        "merchantDetails": {
          "name": area.name,
          "phone": "This store mobile",
          "area": area.lga,
          "address": "This store address",
          "longitude": 0,
          "latitude": 0
        },
        "customerDetails": {
          "name": `${orderDetails.shipping_address.firstname} ${orderDetails.shipping_address.lastname}`,
          "phone": orderDetails.billing_address.telephone,
          "area": "Ogba",
          "address": orderDetails.shipping_address.street,
          "longitude": 0,
          "latitude": 0
        },
        "deliveryNote": "string",
        "amount": orderDetails.payment.amount_ordered,
        "amountDue": payment,
        "estimatedPickupTime": 0,
        "estimatedDeliveryTime": 0,
        "callbackReferenceKey": "string",
        "deliveryMode": orderDetails.delivery_mode
      };
      this.logger.log({msg: 'dispatch payload created',dispatchPayload})
      return dispatchPayload;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }
}