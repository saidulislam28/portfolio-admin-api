// /* eslint-disable @typescript-eslint/require-await */
// import { Injectable } from "@nestjs/common";
// import { PrismaService } from "src/prisma/prisma.service";

// import { CreateBookOrderDto } from "../dtos/book-order.dto";

// @Injectable()
// export class BookOrderService {
//     constructor(private readonly prismaService: PrismaService) { }

//     async createBookOrder(data: CreateBookOrderDto, userId: number) {
//         delete data?.id;

//         const orderItems = data?.bookorderItems?.map(element => {
//             return {
//                 book_id: element?.book_id,
//                 qty: element?.qty,
//                 unit_price: element?.unit_price,
//                 subtotal: element?.subtotal,
//             }
//         })

//         const payload = {
//             user_id: Number(userId),
//             phone: data?.phone,
//             delivery_address: data?.delivery_address,
//             subtotal: data?.subtotal,
//             delivery_charge: data?.delivery_charge,
//             total: data?.total,
//             BookOrderItem: { create: orderItems },
//         }
//     }
// }