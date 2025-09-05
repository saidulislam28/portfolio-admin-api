// <!DOCTYPE html>
// <html>
// <head>
//     <meta charset="utf-8">
//     <title>Medical Consultation Invoice</title>
//     <style>
//         body { 
//             font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
//             margin: 0; 
//             padding: 20px; 
//             color: #333;
//             line-height: 1.6;
//         }
//         .header { 
//             background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//             color: white;
//             padding: 30px; 
//             margin-bottom: 30px;
//             border-radius: 12px;
//             position: relative;
//         }
//         .header::after {
//             content: '';
//             position: absolute;
//             bottom: -10px;
//             left: 50%;
//             transform: translateX(-50%);
//             width: 0;
//             height: 0;
//             border-left: 20px solid transparent;
//             border-right: 20px solid transparent;
//             border-top: 10px solid #764ba2;
//         }
//         .company-info { 
//             text-align: right; 
//             margin-bottom: 20px; 
//         }
//         .company-info h2 {
//             margin: 0;
//             font-size: 24px;
//             font-weight: 600;
//         }
//         .medical-header {
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             gap: 15px;
//             margin-bottom: 20px;
//         }
//         .medical-icon {
//             width: 50px;
//             height: 50px;
//             background-color: rgba(255,255,255,0.2);
//             border-radius: 50%;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             font-size: 24px;
//         }
//         .invoice-details { 
//             display: grid;
//             grid-template-columns: 1fr 1fr;
//             gap: 20px;
//             margin-bottom: 30px; 
//         }
//         .invoice-info, .customer-info {
//             background-color: #f8f9fa; 
//             padding: 20px; 
//             border-radius: 10px;
//             border-left: 4px solid #667eea;
//         }
//         .services-table { 
//             width: 100%; 
//             border-collapse: collapse; 
//             margin-bottom: 30px; 
//             box-shadow: 0 2px 8px rgba(0,0,0,0.1);
//             border-radius: 8px;
//             overflow: hidden;
//         }
//         .services-table th { 
//             background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//             color: white;
//             padding: 15px 12px;
//             text-align: left;
//             font-weight: 600;
//         }
//         .services-table td { 
//             padding: 15px 12px; 
//             border-bottom: 1px solid #eee;
//         }
//         .services-table tr:last-child td {
//             border-bottom: none;
//         }
//         .services-table tr:nth-child(even) {
//             background-color: #f8f9fa;
//         }
//         .medical-service {
//             display: flex;
//             align-items: center;
//             gap: 10px;
//         }
//         .service-icon {
//             width: 30px;
//             height: 30px;
//             background-color: #667eea;
//             border-radius: 50%;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             color: white;
//             font-size: 12px;
//         }
//         .total-section { 
//             text-align: right; 
//             margin-top: 20px;
//             background-color: #f8f9fa;
//             padding: 20px;
//             border-radius: 10px;
//             border-left: 4px solid #28a745;
//         }
//         .total-amount { 
//             font-size: 24px; 
//             font-weight: bold; 
//             color: #28a745;
//             margin: 10px 0;
//         }
//         .payment-status {
//             display: inline-block;
//             padding: 8px 16px;
//             background-color: #28a745;
//             color: white;
//             border-radius: 20px;
//             font-size: 14px;
//             font-weight: 600;
//             text-transform: uppercase;
//         }
//         .footer { 
//             margin-top: 50px; 
//             text-align: center; 
//             padding: 30px;
//             background-color: #f8f9fa;
//             border-radius: 10px;
//         }
//         .footer-logo {
//             width: 60px;
//             height: 60px;
//             background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//             border-radius: 50%;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             margin: 0 auto 15px auto;
//             color: white;
//             font-size: 24px;
//         }
//         .qr-code {
//             margin-top: 20px;
//             text-align: center;
//         }
//         .medical-disclaimer {
//             background-color: #fff3cd;
//             border: 1px solid #ffeaa7;
//             border-radius: 8px;
//             padding: 15px;
//             margin: 20px 0;
//             font-size: 12px;
//             color: #856404;
//         }
//     </style>
// </head>
// <body>
//     <div class="header">
//         <div class="medical-header">
//             <div class="medical-icon">⚕️</div>
//             <div>
//                 <h1 style="margin: 0; font-size: 28px;">MEDICAL CONSULTATION</h1>
//                 <p style="margin: 5px 0 0 0; opacity: 0.9;">Professional Healthcare Invoice</p>
//             </div>
//         </div>
//         <div class="company-info">
//             <h2>{{companyName}}</h2>
//             <p style="margin: 5px 0;">{{companyAddress}}</p>
//             <p style="margin: 5px 0;">📧 {{companyEmail}} | 📞 {{companyPhone}}</p>
//         </div>
//     </div>

//     <div class="invoice-details">
//         <div class="invoice-info">
//             <h3 style="color: #667eea; margin-top: 0;">📋 Invoice Information</h3>
//             <p><strong>Invoice Number:</strong> {{invoiceNumber}}</p>
//             <p><strong>Invoice Date:</strong> {{invoiceDate}}</p>
//             <p><strong>Order ID:</strong> #{{order.id}}</p>
//             <p><strong>Service Category:</strong> Medical Consultation</p>
//         </div>

//         <div class="customer-info">
//             <h3 style="color: #667eea; margin-top: 0;">👤 Patient Information</h3>
//             <p><strong>{{order.user.name}}</strong></p>
//             <p>📧 {{order.user.email}}</p>
//             {{#if order.user.phone}}
//             <p>📞 {{order.user.phone}}</p>
//             {{/if}}
//         </div>
//     </div>

//     <table class="services-table">
//         <thead>
//             <tr>
//                 <th>🏥 Medical Service</th>
//                 <th>👨‍⚕️ Healthcare Provider</th>
//                 <th>📅 Consultation Date</th>
//                 <th>💰 Consultation Fee</th>
//             </tr>
//         </thead>
//         <tbody>
//             {{#each order.appointments}}
//             <tr>
//                 <td>
//                     <div class="medical-service">
//                         <div class="service-icon">⚕️</div>
//                         <div>
//                             <div><strong>{{service.name}}</strong></div>
//                             <div style="font-size: 12px; color: #666;">Professional Medical Consultation</div>
//                         </div>
//                     </div>
//                 </td>
//                 <td>
//                     <div>
//                         <strong>Dr. {{doctor.name}}</strong>
//                         {{#if doctor.specialization}}
//                         <div style="font-size: 12px; color: #667eea;">{{doctor.specialization}}</div>
//                         {{/if}}
//                     </div>
//                 </td>
//                 <td>{{appointment_date}}</td>
//                 <td style="font-weight: 600; color: #28a745;">${{../order.total_amount}}</td>
//             </tr>
//             {{/each}}
//         </tbody>