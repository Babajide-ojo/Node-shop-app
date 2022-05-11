const nodemailer = require("nodemailer");
//const config = require("../config/auth.config");



const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: 'ojobabajide629@gmail.com',
    pass: 'epxjlnhnhaexggdw'
  },
});

module.exports.sendConfirmationEmail = (name, email, confirmationCode) => {
  console.log("Check", name, email);
  transport.sendMail({
    from: 'ojobabajide629@gmail.com',
    to: email,
    subject: "Please confirm your KimLearn account",
    html: `
        
        <body style="background-color: #e9ecef;">

  <!-- start preheader -->
  <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">

  </div>
  <!-- end preheader -->

  <!-- start body -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%">

    <!-- start logo -->
    <tr>
      <td align="center" bgcolor="#e9ecef">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          <tr>
          </tr>
        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
    <!-- end logo -->

    <!-- start hero -->
    <tr>
      <td align="center" bgcolor="#e9ecef">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          <tr>
            <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
              <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">   Hello ${name}</h1>
            </td>
          </tr>
        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
    <!-- end hero -->

    <!-- start copy block -->
    <tr>
      <td align="center" bgcolor="#e9ecef">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">

          <!-- start copy -->
          <tr>
            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
              <p style="margin: 0;">Tap the button below to confirm your email address. If you didn't create an account with <a href=https://kimlearn.app.netlify>KimLearn</a>, you can safely delete this email.</p>
            </td>
          </tr>
          <!-- end copy -->

          <!-- start button -->
          <tr>
            <td align="left" bgcolor="#ffffff">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" bgcolor="#ffffff" style="padding: 12px;">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;">
                          <a href=https://kimlearn.app.netlify/confirm/${confirmationCode} target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">Cornfirm email</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- end button -->

          <!-- start copy -->
          <tr>
            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
              <p style="margin: 0;">If that doesn't work, copy and paste the following link in your browser:</p>
              <p style="margin: 0;"><a href=https://kimlearn.app.netlify/confirm/${confirmationCode} target="_blank">https://same-link-as-button.url/xxx-xxx-xxxx</a></p>
            </td>
          </tr>
          <!-- end copy -->

          <!-- start copy -->
          <tr>
            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
              <p style="margin: 0;">Cheers,<br> Paste</p>
            </td>
          </tr>
          <!-- end copy -->

        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
    <!-- end copy block -->

    <!-- start footer -->
    <tr>
      <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">

          <!-- start permission -->
          <tr>
            <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
              <p style="margin: 0;">You received this email because we received a request for an account creation. If you didn't make this request you can safely delete this email.</p>
            </td>
          </tr>
          <!-- end permission -->

          <!-- start unsubscribe -->
        
          <!-- end unsubscribe -->

        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
    <!-- end footer -->

  </table>
  <!-- end body -->

</body>`,
  }).catch(err => console.log(err));
};



//it

// (function () {
//     var userCredentials = formelo().getCurrentUserProfile();
//     var token = userCredentials.bearer_token;
//     var email = userCredentials.email_address;
//     var testEmail = "supervisorhq@dpr.gov.ng";
//     var formtype = "IT";
//     //alert(JSON.stringify(userCredentials.username));
//     var toastMessage = "Fetching data...";
  
//     if (email === "juliet.nkwor@brandonetech.com") {
//       email = "supervisorhq@dpr.gov.ng";
//     }
  
//     try {

      
//       var url = 
      
//        "https://dprconnect.pmglobaltechnology.com/api/cng-compression-station/inspections?email=" +
//         email +
//         "&formtype=" +
//         formtype +
//         "&test=true" +
//         "&token=eyJJc3N1ZXIiOiJBRERPTlNBVVRPR0FTVVRJTElTQVRJT04ifQ"; 
//       formelo().showSpinner(toastMessage);
//       fetch(url, {
//         headers: {
//           //Authorization: 'Bearer ' + token,
//           "Content-Type": "application/json"
//         }
//       })
//         .then(function (response) {
//           if (response.status >= 200 && response.status < 300) {
//             return response.json();
//           } else {
//             var error = new Error(response.statusText);
//             error.response = response;
//             throw error;
//           }
//         })
//         .then(function (res) {
 
//           var newData = [];
//           res.data.map(function (item) {
//             newData.push({
//               title: item.company_name,
//               description: item.facility_address,
//               extra: item
//             });
//           });
//           formelo().hideSpinner();
        
        
//           var options = {
//             name: "Showing 100 results"
//           };
//           formelo()
//             .selectItem(newData, options)
//             .then(function (item) {
//               var customer = formelo().flattenObject(item.extra);
//               for (var key in customer) {
//                 if (customer[key]) {
//                   formelo().setVal(key, customer[key]);
//                 }
//                    if (
//                         key == "license_type" &&
//                           customer[key] == "INTEGRITY TEST (COMPRESSION)"
//                             ) {
//                                 formelo().setVal(key, "IT");
//                             }
//               }
  
//               var unique_key = "application_id";
//               var unique_value = customer[unique_key];
//               var collection_id = "ml3yv1jx";
//               var correlation_field_key = "correlation_id";
  
//               var docs_url =
//                 "https://smartinspector.dpr.gov.ng/api/documents?collection.id=" +
//                 collection_id +
//                 "&data.application_id=" +
//                 unique_value;
  
//               try {
//                 fetch(docs_url, {
//                   headers: {
//                     Authorization: "Bearer " + token,
//                     "Content-Type": "application/json"
//                   }
//                 })
//                   .then(function (response) {
//                     if (response.status >= 200 && response.status < 300) {
//                       return response.json();
//                     } else {
//                       var error = new Error(response.statusText);
//                       error.response = response;
//                       throw error;
//                     }
//                   })
//                   .then(function (res) {
//                     var records = res;
//                     var correlation_value =
//                       /*unique_value + "-" +*/ records.length;
//                     /*if (correlation_value > 0) {
//           formelo.setVal(unique_key, unique_value + correlation_value);
//       }*/
//                     formelo().setVal(correlation_field_key, correlation_value);
//                   });
//               } catch (err) {
//                 formelo().toast(e.message, "long");
//               }
//               formelo().hideSpinner();
//             });
//         })
//         .catch(function (e) {
//           formelo().toast("Server Error. Please try again", "long");
//           //alert(JSON.stringify(e));
//           formelo().hideSpinner();
//         });
//     } catch (e) {
//       formelo().toast(e.message, "long");
//       formelo().hideSpinner();
//     }
//   })();