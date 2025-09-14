import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { formatMoney } from './format_money';


const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatServiceType = (type) => {
  if (!type) return 'N/A';
  return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const getStatusColor = (status) => {
  const colors = {
    'Pending': '#faad14',
    'Confirmed': '#52c41a',
    'Completed': '#1890ff',
    'Cancelled': '#ff4d4f',
    'Processing': '#722ed1'
  };
  return colors[status] || '#666';
};

const getPaymentStatusColor = (status) => {
  const colors = {
    'paid': '#52c41a',
    'unpaid': '#ff4d4f',
    'pending': '#faad14',
    'failed': '#ff4d4f'
  };
  return colors[status] || '#666';
};

export const generatePDF = async (data, fileName = 'order-details') => {
  try {
    // Create PDF content element
    const pdfContent = createPDFContent(data);

    // Append to body temporarily
    document.body.appendChild(pdfContent);

    // Generate canvas from HTML
    const canvas = await html2canvas(pdfContent, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    // Remove temporary element
    document.body.removeChild(pdfContent);

    // Create PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Download PDF
    pdf.save(`${fileName}-${data.id}.pdf`);

    return { success: true };
  } catch (error) {
    console.error('PDF generation failed:', error);
    return { success: false, error: error.message };
  }
};

const createPDFContent = (data) => {
  const container = document.createElement('div');
  container.style.cssText = `
    width: 794px;
    padding: 40px;
    font-family: Arial, sans-serif;
    background: white;
    color: #333;
    line-height: 1.6;
    position: absolute;
    left: -9999px;
    top: 0;
  `;

  const examCenter = data.order_info?.exam_canter ?
    JSON.parse(data.order_info.exam_canter) : null;

  container.innerHTML = `
    <div style="border-bottom: 3px solid #1890ff; padding-bottom: 20px; margin-bottom: 30px;">
      <h1 style="color: #1890ff; margin: 0; font-size: 28px; font-weight: bold;">
        IELTS Exam Registration
      </h1>
      <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">
        Generated on ${new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })}
      </p>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
      <div>
        <h2 style="color: #1890ff; font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid #f0f0f0; padding-bottom: 5px;">
          Order Information
        </h2>
        <div style="background: #fafafa; padding: 15px; border-radius: 6px;">
          <p><strong>Order ID:</strong> #${data.id}</p>
          <p><strong>Service Type:</strong> ${formatServiceType(data.service_type)}</p>
          <p><strong>Status:</strong> 
            <span style="padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; 
                         background: ${getStatusColor(data.status)}; color: white;">
              ${data.status}
            </span>
          </p>
          <p><strong>Payment Status:</strong>
            <span style="padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: bold;
                         background: ${getPaymentStatusColor(data.payment_status)}; color: white;">
              ${data.payment_status}
            </span>
          </p>
          <p><strong>Order Date:</strong> ${formatDate(data.created_at)}</p>
        </div>
      </div>

      <div>
        <h2 style="color: #1890ff; font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid #f0f0f0; padding-bottom: 5px;">
          Customer Information
        </h2>
        <div style="background: #fafafa; padding: 15px; border-radius: 6px;">
          <p><strong>Name:</strong> ${data.first_name} ${data.last_name}</p>
          <p><strong>Full Name:</strong> ${data.User?.full_name || 'N/A'}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          <p><strong>Address:</strong> ${data.address || 'N/A'}</p>
          <p><strong>Expected Level:</strong> ${data.User?.expected_level || 'N/A'}</p>
           ${data.service_type === 'study_abroad' ? ` <p><strong>Budget:</strong> ${data?.order_info?.budget ? `${formatMoney(Number(data?.order_info?.budget))}` : ''}</p>` : ""}
        </div>
      </div>
    </div>

    ${data.service_type === 'exam_registration' && data.order_info ? `
      <div style="margin-bottom: 30px;">
        <h2 style="color: #1890ff; font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid #f0f0f0; padding-bottom: 5px;">
          Exam Registration Details
        </h2>
        <div style="background: #fafafa; padding: 15px; border-radius: 6px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
              <p><strong>Exam Date:</strong> ${formatDate(data.order_info.exam_date)}</p>
              <p><strong>Occupation:</strong> ${data.order_info.occupation || 'N/A'}</p>
              <p><strong>Education Level:</strong> ${data.order_info.education_level || 'N/A'}</p>
            </div>
            <div>
              <p><strong>Exam Center:</strong> ${data?.ExamCenter?.name || 'N/A'}</p>
              <p><strong>Shipping Address:</strong> ${data.order_info.shipping_address || 'N/A'}</p>
              <p><strong>Passport File:</strong> ${data.order_info.passport_file ? 'Uploaded' : 'Not uploaded'}</p>            
             
            </div>
          </div>
        </div>
      </div>
    ` : ''}


    ${data.service_type === 'study_abroad' ? "" : `
      <div style="margin-bottom: 30px;">
      <h2 style="color: #1890ff; font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid #f0f0f0; padding-bottom: 5px;">
        Package Information
      </h2>
      <div style="background: #fafafa; padding: 15px; border-radius: 6px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div>
            <p><strong>Package Name:</strong> ${data.Package?.name}</p>
            <p><strong>Description:</strong> ${data.Package?.description || 'N/A'}</p>
            <p><strong>Service Type:</strong> ${formatServiceType(data.Package?.service_type)}</p>
          </div>          
        </div>
      </div>
    </div>`}

    ${data.service_type === 'study_abroad' ? "" : ` 
      <div style="margin-bottom: 30px;">
      <h2 style="color: #1890ff; font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid #f0f0f0; padding-bottom: 5px;">
        Payment Summary
      </h2>
      <div style="background: #fafafa; padding: 15px; border-radius: 6px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 10px 0; font-weight: bold;">Original Price (BDT):</td>
            <td style="text-align: right; padding: 10px 0;">৳${data.Package?.price_bdt_original?.toLocaleString()}</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 10px 0; font-weight: bold;">Subtotal:</td>
            <td style="text-align: right; padding: 10px 0;">৳${data.subtotal?.toLocaleString()}</td>
          </tr>
          ${data.delivery_charge ? `
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px 0; font-weight: bold;">Delivery Charge:</td>
              <td style="text-align: right; padding: 10px 0;">৳${data.delivery_charge?.toLocaleString()}</td>
            </tr>
          ` : ''}
          <tr style="border-top: 2px solid #1890ff; background: #e6f7ff;">
            <td style="padding: 15px 0; font-weight: bold; font-size: 16px;">Total Amount:</td>
            <td style="text-align: right; padding: 15px 0; font-weight: bold; font-size: 16px; color: #1890ff;">
              ৳${data.total?.toLocaleString()}
            </td>
          </tr>
        </table>
      </div>
    </div>`}

   

    ${data.cancel_reason ? `
      <div style="margin-bottom: 30px;">
        <h2 style="color: #ff4d4f; font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid #f0f0f0; padding-bottom: 5px;">
          Cancellation Details
        </h2>
        <div style="background: #fff2f0; padding: 15px; border-radius: 6px; border-left: 4px solid #ff4d4f;">
          <p><strong>Cancellation Reason:</strong> ${data.cancel_reason}</p>
          <p><strong>Canceled At:</strong> ${formatDate(data.canceled_at)}</p>
        </div>
      </div>
    ` : ''}

    <div style="margin-bottom: 20px;">
      <h2 style="color: #1890ff; font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid #f0f0f0; padding-bottom: 5px;">
        Additional Information
      </h2>
      <div style="background: #fafafa; padding: 15px; border-radius: 6px;">
        <p><strong>User ID:</strong> ${data.user_id}</p>
        ${data.service_type === 'study_abroad' ? "" : `<p><strong>Package ID:</strong> ${data.package_id}</p>`}        
        <p><strong>Last Updated:</strong> ${formatDate(data.updated_at)}</p>
        <p><strong>Delivery Address:</strong> ${data.address || 'N/A'}</p>
      </div>
    </div>

    <div style="border-top: 2px solid #f0f0f0; padding-top: 20px; text-align: center; color: #666; font-size: 12px;">
      <p>This is a computer-generated document. No signature is required.</p>
      <p>For any queries, please contact our support team.</p>
    </div>
  `;

  return container;
};