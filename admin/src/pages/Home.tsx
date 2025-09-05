import { Card, Space, Typography } from 'antd';
const { Title } = Typography;

const Home = () => {
  return (
    <>
      <Card bordered={false}>
        <Space wrap>
          <Title level={2}>Welcome</Title>
        </Space>
      </Card>
    </>
  );
};

export default Home;
