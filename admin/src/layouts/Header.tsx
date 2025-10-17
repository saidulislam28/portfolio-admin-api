import { Layout, Menu, theme } from 'antd';
import React, { useState } from 'react';
const { Header, Sider, Content } = Layout;

const { SubMenu } = Menu

export default function HeaderNav() {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
      } = theme.useToken();

    /*const rightContent = [
        <Menu key="user" mode="horizontal" onClick={this.handleClickMenu}>
            <SubMenu
                title={
                    <Fragment>
              <span style={{ color: '#999', marginRight: 4 }}>
                <p>Hi</p>
              </span>
                        <span>'text</span>
                        {/!*<Avatar style={{ marginLeft: 8 }} src={avatar} />*!/}
                    </Fragment>
                }
            >
                <Menu.Item key="SignOut">
                    <p>Sign out</p>
                </Menu.Item>
            </SubMenu>
        </Menu>,
    ];*/

    /*rightContent.unshift(
        <Popover
            placement="bottomRight"
            trigger="click"
            key="notifications"
            overlayClassName={styles.notificationPopover}
            getPopupContainer={() => document.querySelector('#primaryLayout')}
            content={
                <div className={styles.notification}>
                    <List
                        itemLayout="horizontal"
                        dataSource={notifications}
                        locale={{
                            emptyText: <Trans>You have viewed all notifications.</Trans>,
                        }}
                        renderItem={item => (
                            <List.Item className={styles.notificationItem}>
                                <List.Item.Meta
                                    title={
                                        <Ellipsis tooltip lines={1}>
                                            {item.title}
                                        </Ellipsis>
                                    }
                                    description={dayjs(item.date).fromNow()}
                                />
                                <RightOutlined style={{ fontSize: 10, color: '#ccc' }} />
                            </List.Item>
                        )}
                    />
                    {notifications.length ? (
                        <div
                            onClick={onAllNotificationsRead}
                            className={styles.clearButton}
                        >
                            <Trans>Clear notifications</Trans>
                        </div>
                    ) : null}
                </div>
            }
        >
            <Badge
                count={notifications.length}
                dot
                offset={[-10, 10]}
                className={styles.iconButton}
            >
                <BellOutlined className={styles.iconFont} />
            </Badge>
        </Popover>
    );*/

	return (
	    <Header style={{ padding: 0, background: colorBgContainer }}>
          {/*{React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: () => setCollapsed(!collapsed),
          })}*/}
            {/*<div>{rightContent}</div>*/}
        </Header>
	);
}
