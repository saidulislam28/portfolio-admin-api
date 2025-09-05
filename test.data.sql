INSERT INTO orders (
  first_name, last_name, email, phone, address, status, payment_status,
  service_type, meta_data, user_id, package_id, delivery_address, date,
  subtotal, delivery_charge, order_info, total, cancel_reason, canceled_at,
  created_at, updated_at
) VALUES
(
  'John', 'Doe', 'john.doe@example.com', '01700000001', '123 Street, Dhaka',
  'Approved', 'paid', 'speaking_mock_test',
  '{"notes":"Urgent delivery"}', 1, 10, '456 Delivery Rd, Dhaka',
  '2025-07-20 10:00:00', 200.00, 20.00,
  '{"items":[{"name":"Mock Test Speaking"}]}', 220.00,
  NULL, NULL,
  '2025-07-20 09:55:00', '2025-07-20 09:55:00'
),
(
  'Jane', 'Smith', 'jane.smith@example.com', '01700000002', '789 Avenue, Chittagong',
  'Approved', 'paid', 'speaking_mock_test',
  '{"priority":"High"}', 1, 10, '321 Delivery Ave, Chittagong',
  '2025-07-21 14:30:00', 180.00, 15.00,
  '{"items":[{"name":"Speaking Test"}]}', 195.00,
  NULL, NULL,
  '2025-07-21 14:00:00', '2025-07-21 14:00:00'
),
(
  'Alice', 'Rahman', 'alice.rahman@example.com', '01700000003', '456 Lane, Sylhet',
  'Approved', 'paid', 'speaking_mock_test',
  '{"language":"English"}', 1, 10, '654 Delivery Blvd, Sylhet',
  '2025-07-22 16:45:00', 250.00, 25.00,
  '{"items":[{"name":"IELTS Mock Speaking"}]}', 275.00,
  NULL, NULL,
  '2025-07-22 16:30:00', '2025-07-22 16:30:00'
);

INSERT INTO appointments (
  start_at, end_at, status, duration_in_min, notes, booked_at, token,
  consultant_id, user_id, cancel_reason, order_id, slot_date, slot_time,
  user_timezone, created_at, updated_at
) VALUES
(
  '2025-07-24 08:00:00', '2025-07-24 08:20:00', 'CONFIRMED', 20,
  'Speaking mock test - early morning', '2025-07-23 12:00:00', 'token-abc123',
  1, 1, NULL, 1, '2025-07-24', '08:00', 'Asia/Dhaka',
  '2025-07-23 12:00:00', '2025-07-23 12:00:00'
),
(
  '2025-07-24 09:00:00', '2025-07-24 09:20:00', 'CONFIRMED', 20,
  'Speaking mock test - mid morning', '2025-07-23 12:30:00', 'token-def456',
  1, 1, NULL, 2, '2025-07-24', '09:00', 'Asia/Dhaka',
  '2025-07-23 12:30:00', '2025-07-23 12:30:00'
),
(
  '2025-07-24 10:00:00', '2025-07-24 10:20:00', 'CONFIRMED', 20,
  'Speaking mock test - late morning', '2025-07-23 13:00:00', 'token-ghi789',
  1, 1, NULL, 3, '2025-07-24', '10:00', 'Asia/Dhaka',
  '2025-07-23 13:00:00', '2025-07-23 13:00:00'
);

For create 3 appointment.