/* eslint-disable */
import { UploadOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Card, Form, Input, Upload, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useEffect } from "react";
import { get, post } from "~/services/api/api";
import { API_FILE_UPLOAD, getUrlForModel } from "~/services/api/endpoints";
import { getHeader } from "~/utility/helmet";
import { getImageFieldsKeys } from "./settings";
import PageTitle from "~/components/PageTitle";
const model = "Setting";
const title = "Setting";

const KEY = `all-${model}`;

const Settings = () => {
  const [form] = Form.useForm();

  const {
    isLoading,
    data: settingsResponse,
    isSuccess,
    refetch,
  } = useQuery({
    queryKey: [KEY],
    queryFn: () => get(getUrlForModel(model)),
  });

  useEffect(() => {
    let data: any = {};
    if (isSuccess && settingsResponse?.data) {
      const imageFields = getImageFieldsKeys();
      settingsResponse?.data?.map((item: { key: never; value: string }) => {
        if (imageFields.includes(item.key)) {
          data[item.key] = [
            {
              uid: "-1",
              status: "done",
              thumbUrl: item.value,
            },
          ];
        } else {
          data[item.key] = item.value;
        }
      });
    }

    if (data) {
      form.setFieldsValue(data);
    }
  }, [isLoading]);

  const createData: any = useMutation({
    mutationFn: async (data: any) => await post("admin/settings", data.data),
    onSuccess: (response) => {
      refetch();
      form.resetFields();
      message.success("Saved Successfully");
      window.location.reload();
    },
    onError: () => {
      form.resetFields();
      message.error("Something went wrong");
    },
  });

  const onFinish = async (formValues: any) => {
    const dataArray: any = [];
    if (formValues.hero_image) {
      const heroImage =
        formValues?.hero_image[0]?.response?.url ??
        formValues?.hero_image[0]?.thumbUrl ??
        null;
      formValues.hero_image = heroImage;
    }

    if (formValues.logo) {
      const logoImage =
        formValues?.logo[0]?.response?.url ??
        formValues?.logo[0]?.thumbUrl ??
        null;
      formValues.logo = logoImage;
    }

    if (formValues.favicon) {
      const faviconImage =
        formValues?.favicon[0]?.response?.url ??
        formValues?.favicon[0]?.thumbUrl ??
        null;
      formValues.favicon = faviconImage;
    }

    for (const key in formValues) {
      if (formValues.hasOwnProperty(key)) {
        dataArray.push({
          key,
          value: formValues[key] === undefined ? null : formValues[key],
        });
      }
    }
    createData.mutate({ data: dataArray });
  };
  return (
    <>
      {getHeader(title)}
      <PageTitle
        title={title}
        breadcrumbs={[
          {
            title: "Dashboard",
            href: "/",
          },
          {
            title: title,
          },
        ]}
        rightSection=""
      />
      <Card title="Settings">
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <h3 style={{ borderBottom: "1px ridge" }}>Contact</h3>

          <Form.Item label="Email" name="email">
            <Input type="email" placeholder="support email" />
          </Form.Item>
          <Form.Item label="Phone" name="phone">
            <Input placeholder="Contact Number" />
          </Form.Item>
          <Form.Item label="Address" name="address">
            <TextArea rows={5} />
          </Form.Item>
          <h3 style={{ borderBottom: "1px ridge" }}>Images</h3>
          <Form.Item
            label="Logo"
            name="logo"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e && e.fileList;
            }}
          >
            <Upload
              name="file"
              action={API_FILE_UPLOAD}
              maxCount={1}
              listType="picture"
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            label="Favicon"
            name="favi
            con"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e && e.fileList;
            }}
          >
            <Upload
              name="file"
              action={API_FILE_UPLOAD}
              maxCount={1}
              listType="picture"
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
          <h3 style={{ borderBottom: "1px ridge" }}>Social links</h3>
          <Form.Item label="Messenger" name="messenger">
            <Input type="url" />
          </Form.Item>
          <Form.Item label="Linkedin" name="linkedin">
            <Input type="url" />
          </Form.Item>
          <Form.Item label="github" name="github">
            <Input type="url" />
          </Form.Item>
          <Form.Item label="Instagram" name="instagram">
            <Input type="url" />
          </Form.Item>
          <Form.Item label="Twitter" name="twitter">
            <Input type="url" />
          </Form.Item>
          <Form.Item label="Resume" name="resume">
            <Input type="url" />
          </Form.Item>
          <Form.Item label="CV" name="cv">
            <Input type="url" />
          </Form.Item>

          <h3 style={{ borderBottom: "1px ridge" }}>Hero</h3>
          <Form.Item label="Name" name="name">
            <Input type="text" placeholder="Name" />
          </Form.Item>
          <Form.Item label="Hero title" name="hero_title">
            <Input />
          </Form.Item>
          <Form.Item label="Hero description" name="hero_desc">
            <TextArea rows={5} />
          </Form.Item>
          <Form.Item
            label="Hero image"
            name="hero_image"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e && e.fileList;
            }}
          >
            <Upload
              name="file"
              action={API_FILE_UPLOAD}
              maxCount={1}
              listType="picture"
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>

          <h3 style={{ borderBottom: "1px ridge" }}>Brand</h3>
          <Form.Item label="Web Name" name="web_name">
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 2, span: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={createData?.isLoading}
            >
              Save
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

export default Settings;
