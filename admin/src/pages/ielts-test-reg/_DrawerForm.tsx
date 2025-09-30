import React, { useEffect, useState } from "react";
import { Button, Form, message, Card, Upload } from "antd";
import { useMutation, useQuery } from "@tanstack/react-query";
import { post, get } from "~/services/api/api";
import { API_FILE_UPLOAD, getUrlForModel } from "~/services/api/endpoints";
import { UploadOutlined } from "@ant-design/icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { getHeader } from "~/utility/helmet";
import PageTitle from "~/components/PageTitle";
const model = "Setting";
const title = "Description";

const IeltsTestRegistrationForm = () => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: settingsResponse, isSuccess } = useQuery({
    queryKey: [title],
    queryFn: () => get(getUrlForModel(model)),
  });

  useEffect(() => {
    if (isSuccess && settingsResponse?.data) {
      const initialValues = {};
      settingsResponse.data.forEach((item) => {
        if (item.key === "ielts_image" && item.value) {
          initialValues[item.key] = [
            {
              uid: "-1",
              name: "current-image",
              status: "done",
              url: item.value,
              thumbUrl: item.value,
            },
          ];
        } else {
          initialValues[item.key] = item.value;
        }
      });
      form.setFieldsValue(initialValues);
    }
  }, [isSuccess, settingsResponse?.data]);

  const createDataMutation = useMutation({
    mutationFn: async (data: any) => await post("admin/settings", data.data),
    onSuccess: () => {
      message.success("Saved Successfully");
      setIsSubmitting(false);
    },
    onError: () => {
      message.error("Something went wrong");
      setIsSubmitting(false);
    },
  });

  const onFinish = async (formValues) => {
    setIsSubmitting(true);
    const dataArray = Object.entries(formValues).map(([key, value]) => ({
      key,
      value: value === undefined ? null : value,
    }));

    if (formValues.ielts_image && formValues.ielts_image.length > 0) {
      const imageFile = formValues.ielts_image[0];
      const imageUrl = imageFile.response?.url || imageFile.url || null;
      const imageIndex = dataArray.findIndex(
        (item) => item.key === "ielts_image"
      );
      if (imageIndex !== -1) {
        dataArray[imageIndex].value = imageUrl;
      }
    }

    createDataMutation.mutate({ data: dataArray });
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    if (e?.fileList) {
      return e.fileList;
    }
    return [];
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
        rightSection={""}
      />
      <Card>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="ielts_description"
            label="Page Content"
            rules={[{ required: true }]}
          >
            <ReactQuill
              theme="snow"
              style={{ height: "400px", marginBottom: "50px" }}
              modules={{
                toolbar: [
                  [{ header: "1" }, { header: "2" }, { font: [] }],
                  ["bold", "italic", "underline", "strike", "blockquote"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link", "image"],
                  ["clean"],
                ],
              }}
            />
          </Form.Item>

          <br />
          <br />
          <br />
          <br />
          <br />

          <Form.Item
            label="Banner Image"
            name="ielts_image"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload
              name="file"
              action={API_FILE_UPLOAD}
              maxCount={1}
              listType="picture"
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              Save Content
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

export default IeltsTestRegistrationForm;
