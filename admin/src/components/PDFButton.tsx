import React, { useState } from 'react';
import { Button, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { generatePDF } from '~/utility/pdfGenerator';

const PDFDownloadButton = ({
    data,
    fileName = 'order-details',
    buttonText = 'Download PDF',
    size = 'large',
    type = 'primary',
    loading: externalLoading = false,
    disabled = false,
    ...buttonProps
}) => {
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        if (!data) {
            message.error('No data available for PDF generation');
            return;
        }

        setLoading(true);

        try {
            const result = await generatePDF(data, fileName);

            if (result.success) {
                message.success('PDF downloaded successfully!');
            } else {
                message.error(`PDF generation failed: ${result.error}`);
            }
        } catch (error) {
            console.error('Download error:', error);
            message.error('Failed to download PDF. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            type={type}
            size={size}
            icon={<DownloadOutlined />}
            loading={loading || externalLoading}
            disabled={disabled || !data}
            onClick={handleDownload}
            {...buttonProps}
        >
            {buttonText}
        </Button>
    );
};

export default PDFDownloadButton;