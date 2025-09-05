import { PrismaClient, ServiceType } from '@prisma/client';
import { format, addDays, subHours, setHours, setMinutes } from 'date-fns';

const prisma = new PrismaClient();

// Helper to get random item from array
const random = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Helper to generate a unique token
const generateToken = () => Math.random().toString(36).substring(2, 15);

export async function seedAppointmentsAndOrders() {
  console.log('🌱 Seeding mock test appointments, conversation appointments, and book purchase orders...');

  // Fetch required data
  const users = await prisma.user.findMany({
    // where: { is_test_user: true },
    take: 5,
  });

  const mockTestConsultants = await prisma.consultant.findMany({
    where: { is_mocktest: true },
  });

  const conversationConsultants = await prisma.consultant.findMany({
    where: { is_conversation: true },
  });

  const mockTestPackage = await prisma.package.findFirst({
    where: { service_type: ServiceType.speaking_mock_test },
  });

  const conversationPackage = await prisma.package.findFirst({
    where: { service_type: ServiceType.conversation },
  });

  const books = await prisma.book.findMany({
    where: { is_available: true },
    take: 5,
  });

  if (users.length === 0) {
    console.warn('⚠️ No test users found. Skipping seeding.');
    return;
  }

  if (mockTestConsultants.length === 0 || conversationConsultants.length === 0) {
    console.warn('⚠️ No consultants found for mock test or conversation. Skipping.');
    return;
  }

  if (!mockTestPackage || !conversationPackage) {
    console.warn('⚠️ Required packages not found. Make sure speaking_mock_test, conversation, and book_purchase packages exist.');
    return;
  }

  if (books.length === 0) {
    console.warn('⚠️ No available books found. Run seedBooks() first.');
    return;
  }

  const appointmentsData = [];
  const ordersData = [];
  const orderItemsData = [];

  const now = new Date();

  // Generate 5 mock test appointments
  for (let i = 0; i < 5; i++) {
    const user = random(users);
    const consultant = random(mockTestConsultants);
    const startDate = addDays(subHours(setHours(setMinutes(now, 30), 10), 1), i + 1); // Daily at 10:30 AM
    const endDate = addDays(subHours(setHours(setMinutes(now, 50), 10), 1), i + 1); // Ends at 10:50 AM

    const order = {
      first_name: user.full_name?.split(' ')[0] || 'Test',
      last_name: user.full_name?.split(' ').slice(1).join(' ') || 'User',
      email: user.email!,
      phone: user.phone!,
      user_id: user.id,
      package_id: mockTestPackage.id,
      service_type: 'speaking_mock_test' as const,
      payment_status: 'paid' as const,
      status: 'Approved' as const,
      total: mockTestPackage.price_usd || 20,
      date: startDate,
    };

    ordersData.push(order);

    const appointment = {
      start_at: startDate,
      end_at: endDate,
      duration_in_min: 20,
      booked_at: subHours(startDate, 1),
      slot_date: startDate,
      slot_time: format(startDate, 'HH:mm'),
      user_timezone: user.timezone || 'UTC',
      consultant_id: consultant.id,
      user_id: user.id,
      status: 'CONFIRMED' as const,
      token: generateToken(),
      order_id: 0, // Will be replaced after order creation
    };

    appointmentsData.push({ ...appointment, order });
  }

  // Generate 5 conversation appointments
  for (let i = 0; i < 5; i++) {
    const user = random(users);
    const consultant = random(conversationConsultants);
    const startDate = addDays(subHours(setHours(setMinutes(now, 0), 14), 1), i + 6); // Daily at 2:00 PM
    const endDate = addDays(subHours(setHours(setMinutes(now, 20), 14), 1), i + 6); // Ends at 2:20 PM

    const order = {
      first_name: user.full_name?.split(' ')[0] || 'Test',
      last_name: user.full_name?.split(' ').slice(1).join(' ') || 'User',
      email: user.email!,
      phone: user.phone!,
      user_id: user.id,
      package_id: conversationPackage.id,
      service_type: 'conversation' as const,
      payment_status: 'paid' as const,
      status: 'Approved' as const,
      total: conversationPackage.price_usd || 15,
      date: startDate,
    };

    ordersData.push(order);

    const appointment = {
      start_at: startDate,
      end_at: endDate,
      duration_in_min: 20,
      booked_at: subHours(startDate, 1),
      slot_date: startDate,
      slot_time: format(startDate, 'HH:mm'),
      user_timezone: user.timezone || 'UTC',
      consultant_id: consultant.id,
      user_id: user.id,
      status: 'CONFIRMED' as const,
      token: generateToken(),
      order_id: 0, // Will be replaced
    };

    appointmentsData.push({ ...appointment, order });
  }

  // Generate 5 book purchase orders
  for (let i = 0; i < 5; i++) {
    const user = random(users);
    const book = random(books);
    const qty = Math.floor(Math.random() * 3) + 1; // 1-3 books
    const subtotal = book.price * qty;

    const order = {
      first_name: user.full_name?.split(' ')[0] || 'Test',
      last_name: user.full_name?.split(' ').slice(1).join(' ') || 'User',
      email: user.email!,
      phone: user.phone!,
      user_id: user.id,
      service_type: 'book_purchase' as const,
      payment_status: 'paid' as const,
      status: 'Approved' as const,
      total: subtotal,
      date: subHours(now, i),
    };

    ordersData.push(order);

    orderItemsData.push({
      book_id: book.id,
      qty,
      unit_price: book.price,
      subtotal,
      order,
    });
  }

  // Now create orders first to get their IDs
  const createdOrders = [];
  for (const order of ordersData) {
    try {
      const created = await prisma.order.create({
        data: {
          first_name: order.first_name,
          last_name: order.last_name,
          email: order.email,
          phone: order.phone,
          user_id: order.user_id,
          package_id: order.package_id,
          service_type: order.service_type,
          payment_status: order.payment_status,
          status: order.status,
          total: order.total,
          date: order.date,
        },
      });
      createdOrders.push(created);
    } catch (error) {
      console.error('❌ Error creating order:', error);
    }
  }

  // Link appointments to created order IDs
  const appointmentCreates = appointmentsData.map((apt, index) => {
    const orderId = createdOrders[index]?.id;
    if (!orderId) {
      console.error(`❌ No order ID for appointment index ${index}`);
      return null;
    }
    return prisma.appointment.create({
      data: {
        start_at: apt.start_at,
        end_at: apt.end_at,
        duration_in_min: apt.duration_in_min,
        booked_at: apt.booked_at,
        slot_date: apt.slot_date,
        slot_time: apt.slot_time,
        user_timezone: apt.user_timezone,
        consultant_id: apt.consultant_id,
        user_id: apt.user_id,
        status: apt.status,
        token: apt.token,
        order_id: orderId,
      },
    });
  }).filter(Boolean); // Remove nulls

  // Create order items
  const orderItemCreates = orderItemsData.map((item, index) => {
    const orderId = createdOrders[10 + index]?.id; // Book orders start at index 10
    if (!orderId) return null;
    return prisma.orderItem.create({
      data: {
        order_id: orderId,
        book_id: item.book_id,
        qty: item.qty,
        unit_price: item.unit_price,
        subtotal: item.subtotal,
      },
    });
  }).filter(Boolean);

  // Execute all creates
  try {
    await Promise.all(appointmentCreates);
    await Promise.all(orderItemCreates);
    console.log('✅ Seeded 5 mock test appointments, 5 conversation appointments, and 5 book purchase orders!');
  } catch (error) {
    console.error('❌ Error seeding appointments and orders:', error);
  }
}