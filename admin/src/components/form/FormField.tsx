import {Button, Checkbox, DatePicker, Form, Image, Input, InputNumber, Radio, Select, Switch, Upload} from 'antd';
import React, {useState} from "react";

import ImageField from "~/components/form/ImageField";
import {
    INPUT_CHECKBOX,
    INPUT_DATE, INPUT_DECIMAL,
    INPUT_IMAGE, INPUT_NUMBER, INPUT_PASSWORD,
    INPUT_RADIO,
    INPUT_SELECT,
    INPUT_SELECTMULTI,
    INPUT_TEXTAREA, INPUT_VIDEO
} from "~/components/form/input-types";
import {INPUT_TEXT} from "~/components/form/input-types";

const FormField = ({name, type, label, isRequired, fieldkey, options, form, ...props}) => {
    let c = null;
    const l = label ? label : name.replace("_", " ")
        .replace(/^([a-z])|\s+([a-z])/g, function ($1) {
            return $1.toUpperCase();
        });
    const help = props.help ? props.help: '';

    /* image uplaod*/
    //TODO move this to a speerate compoenenbt
    const [previewImage, setPreviewImage] = useState(null);

    const handlePreview = async (file) => {
        console.log({file});
        // if (!file.url && !file.preview) {
        //     file.preview = await getBase64(file?.file);
        // }
        const url = URL.createObjectURL(file?.file)
        setPreviewImage(url);
    };

    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };
    /*image uplaod*/

    if ([INPUT_TEXT].includes(type)) {
        c = <Form.Item
            label={l}
            name={name}
            required={isRequired}
            // rules={[{ required: true, message: 'Please input your username!' }]}
        >
            <Input/>
        </Form.Item>
    }

    if (type === INPUT_PASSWORD) {
        c = <Form.Item
            label={l}
            name={name}
            // rules={[{ required: true, message: 'Please input your username!' }]}
        >
            <Input.Password />
        </Form.Item>
    }
    if (type === INPUT_CHECKBOX) {
        c = <Form.Item
            label={l}
            name={name}
            valuePropName='checked'
        >
            <Switch />
        </Form.Item>
    }

    if(type === INPUT_NUMBER) {
        c = <Form.Item
            label={l}
            name={name}
            help={help}
            // rules={[{ required: true, message: 'Please input your username!' }]}
        >
            <InputNumber />
        </Form.Item>
    }

    if(type === INPUT_DATE) {
        c = <Form.Item
            label={l}
            name={name}
            help={help}
            // rules={[{ required: true, message: 'Please input your username!' }]}
        >
            <DatePicker />
        </Form.Item>
    }

    if(type === INPUT_SELECT) {
        c = <Form.Item
            label={l}
            name={name}
            help={help}
            // rules={[{ required: true, message: 'Please input your username!' }]}
        >
            <Select
                options={options}
            />
        </Form.Item>
    }

    if(type === INPUT_SELECTMULTI) {
        c = <Form.Item
            label={l}
            name={name}
            help={help}
            // rules={[{ required: true, message: 'Please input your username!' }]}
        >
            <Select
                options={options}
                mode="multiple"
                allowClear
                // style={{ width: '100%' }}
                placeholder="Please select"
            />
        </Form.Item>
    }

    if(type === INPUT_RADIO) {
        c = <Form.Item
            label={l}
            name={name}
            help={help}
            required={isRequired}
            // rules={[{ required: true, message: 'Please input your username!' }]}
        >
            <Radio.Group
            >
                {options?.map( i => <Radio value={i.value} key={`${name}-rad-val-${i.value}`}>{i.label}</Radio>)}
            </Radio.Group>
        </Form.Item>
    }

    if(type === INPUT_IMAGE) {
        c = <ImageField
            form={form}
            label={l}
            name={name}
            help={help}
        />
    }

    /*if(type === INPUT_IMAGE) {
        if (props.value) {
            //TODO for edit, need to display the current image
            let pickedFile;
            let img_url = props.value instanceof File
                ? URL.createObjectURL(props.value)
                : props.value; //value can be either a file object(user selected file) or a url

            if (pickedFile) {
                img_url = URL.createObjectURL(pickedFile)
            }
            c = <Form.Item
                label={l}
                name={name}
                help={help}
                required={isRequired}
                getValueFromEvent={(e) => {
                    console.log({e});
                    if(e && Array.isArray(e.filelist)) {
                        pickedFile = e.filelist[0]
                    }
                }}
                // rules={[{ required: true, message: 'Please input your username!' }]}
            >
                <Input
                    onChange={(e) => {
                        console.log({e});
                        if(e && Array.isArray(e.filelist)) {
                            pickedFile = e.filelist[0]
                        }
                    }}
                    type={'file'}
                    accept="image/png,image/jpeg" />
                <Image
                    width={100}
                    height={100}
                    src={img_url}
                    fallback="data:image/png;base64,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"
                />
            </Form.Item>
        } else {
            c = <Form.Item
                label={l}
                name={name}
                help={help}
                requiredMark={isRequired}
                // rules={[{ required: true, message: 'Please input your username!' }]}
            > <Input
                type={'file'}
                accept="image/png,image/jpeg" />
            </Form.Item>
        }

    }*/
    /*

    if(type === INPUT_DECIMAL) {
        c = <NumberInput
            // maw={400}
            placeholder={props.placeholder ? props.placeholder : ''}
            description={props.description ? props.description: ''}
            key={key}
            label={l}
            required={isRequired}
            precision={2}
            step={0.01}
            {...props}
        />
    }

    if(type === INPUT_TEXTAREA) {
        c = <Textarea
            placeholder={props.placeholder ? props.placeholder : ''}
            description={props.description ? props.description: ''}
            key={key}
            {...props}
            label={l}
            autosize
            minRows={3}
        />
    }





    if(type === INPUT_VIDEO) {
        c = <FileInput
            accept="video/!*"
            key={key}
            {...props}
            label={l}
            icon={<IconUpload size={rem(14)} />} />
    }
     */
    return c;
}

export default FormField;
