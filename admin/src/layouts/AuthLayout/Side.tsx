import { cloneElement } from 'react'

import type { CommonProps } from '@/@types/common'
import LogoLogin from '@/components/template/LogoLogin'
import Avatar from '@/components/ui/Avatar'
import { APP_NAME } from '@/constants/app.constant'

interface SideProps extends CommonProps {
    content?: React.ReactNode
}

const Side = ({ children, content, ...rest }: SideProps) => {
    return (
        <div className="grid lg:grid-cols-3 h-full">
            <div
                className="bg-no-repeat bg-cover py-6 px-16 flex-col justify-between hidden lg:flex"
                style={{
                    backgroundImage: `url('/img/others/auth-side-bg.jpg')`,
                }}
            >
                <LogoLogin mode="dark" />
                <div>
                    <div className="mb-6 flex items-center gap-4">
                        <Avatar
                            className="border-2 border-white"
                            shape="circle"
                            src="/img/avatars/user1.jpeg"
                        />
                        <div className="text-white">
                            <div className="font-semibold text-base">
                                Cent Gustafsson
                            </div>
                            <span className="opacity-80">CTO, Trace</span>
                        </div>
                    </div>
                    <p className="text-lg text-white opacity-80">
                        Construction site is complex and hard to manage. That's why we've built Trace logistics. One place to easily manage all your logistic activities.
                    </p>
                </div>
                <span className="text-white">
                    Copyright &copy; {`${new Date().getFullYear()}`}{' '}
                    <span className="font-semibold">{`${APP_NAME}`}</span>{' '}
                </span>
            </div>
            <div className="col-span-2 flex flex-col justify-center items-center bg-white dark:bg-gray-800">
                <div className="xl:min-w-[450px] px-8">
                    <div className="mb-8">{content}</div>
                    {children
                        ? cloneElement(children as React.ReactElement, {
                              ...rest,
                          })
                        : null}
                </div>
            </div>
        </div>
    )
}

export default Side
