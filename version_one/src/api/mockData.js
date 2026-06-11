// Мок-данные для работы без сервера

export const mockOrders = [
  {
    id: 1,
    order_number: "ORD-2024-001",
    source_warehouse: "Москва (Центральный)",
    target_warehouse: "Санкт-Петербург (Северный)",
    status: "IN_PROGRESS",
    scanned_count: 15,
    total_items: 45,
    created_at: "2024-01-15T10:30:00Z",
    items: [
      { id: 1, product_name: "Ноутбук Lenovo ThinkPad X1", label_code: "LNV-X1-001", scanned: true },
      { id: 2, product_name: "Монитор Dell 27\" 4K", label_code: "DLL-27-002", scanned: true },
      { id: 3, product_name: "Клавиатура Logitech MX Keys", label_code: "LOG-KEY-003", scanned: true },
      { id: 4, product_name: "Мышь Logitech MX Master 3", label_code: "LOG-MS-004", scanned: true },
      { id: 5, product_name: "Док-станция USB-C", label_code: "USB-C-005", scanned: true },
      { id: 6, product_name: "SSD Samsung 1TB", label_code: "SSD-1TB-006", scanned: true },
      { id: 7, product_name: "Кабель USB-C 2м", label_code: "CBL-USB-007", scanned: true },
      { id: 8, product_name: "Блок питания 65W", label_code: "PWR-65-008", scanned: true },
      { id: 9, product_name: "Чехол для ноутбука", label_code: "CASE-009", scanned: true },
      { id: 10, product_name: "Подставка для ноутбука", label_code: "STAND-010", scanned: true },
      { id: 11, product_name: "Веб-камера HD", label_code: "CAM-HD-011", scanned: true },
      { id: 12, product_name: "Микрофон USB", label_code: "MIC-USB-012", scanned: true },
      { id: 13, product_name: "Наушники Sony WH-1000", label_code: "SON-WH-013", scanned: true },
      { id: 14, product_name: "Планшет iPad Air", label_code: "APP-IP-014", scanned: true },
      { id: 15, product_name: "Стилус Apple Pencil", label_code: "APP-PN-015", scanned: true },
      { id: 16, product_name: "Бумага A4 (пачка)", label_code: "PPR-A4-016", scanned: false },
      { id: 17, product_name: "Тонер для принтера", label_code: "TNR-017", scanned: false },
      { id: 18, product_name: "Степлер", label_code: "STP-018", scanned: false },
      { id: 19, product_name: "Скрепки (коробка)", label_code: "CLP-019", scanned: false },
      { id: 20, product_name: "Папки пластиковые", label_code: "FLD-020", scanned: false },
      { id: 21, product_name: "Маркеры (набор)", label_code: "MRK-021", scanned: false },
      { id: 22, product_name: "Клей-карандаш", label_code: "GLU-022", scanned: false },
      { id: 23, product_name: "Ножницы", label_code: "SCS-023", scanned: false },
      { id: 24, product_name: "Линейка 30см", label_code: "RLR-024", scanned: false },
      { id: 25, product_name: "Калькулятор", label_code: "CAL-025", scanned: false }
    ]
  },
  {
    id: 2,
    order_number: "ORD-2024-002",
    source_warehouse: "Санкт-Петербург (Северный)",
    target_warehouse: "Казань (Приволжский)",
    status: "IN_PROGRESS",
    scanned_count: 8,
    total_items: 30,
    created_at: "2024-01-16T14:20:00Z",
    items: [
      { id: 26, product_name: "Серверная стойка 42U", label_code: "SRV-RK-026", scanned: true },
      { id: 27, product_name: "Патч-панель 24 порта", label_code: "PCH-24-027", scanned: true },
      { id: 28, product_name: "Коммутатор Cisco", label_code: "CSC-SW-028", scanned: true },
      { id: 29, product_name: "ИБП 1500VA", label_code: "UPS-15-029", scanned: true },
      { id: 30, product_name: "Кабель питания 3м", label_code: "PWR-3M-030", scanned: true },
      { id: 31, product_name: "Патч-корд 1м", label_code: "PTC-1M-031", scanned: true },
      { id: 32, product_name: "Патч-корд 2м", label_code: "PTC-2M-032", scanned: true },
      { id: 33, product_name: "Оптический кабель 10м", label_code: "FBR-10-033", scanned: true },
      { id: 34, product_name: "SFP модуль", label_code: "SFP-034", scanned: false },
      { id: 35, product_name: "Вентилятор для стойки", label_code: "FAN-RK-035", scanned: false },
      { id: 36, product_name: "Полка для сервера", label_code: "SHLF-036", scanned: false },
      { id: 37, product_name: "Кабельный органайзер", label_code: "CBL-ORG-037", scanned: false },
      { id: 38, product_name: "Винты M6 (набор)", label_code: "SCR-M6-038", scanned: false },
      { id: 39, product_name: "Гайки M6 (набор)", label_code: "NUT-M6-039", scanned: false },
      { id: 40, product_name: "Заглушки для панелей", label_code: "BLK-040", scanned: false }
    ]
  },
  {
    id: 3,
    order_number: "ORD-2024-003",
    source_warehouse: "Москва (Центральный)",
    target_warehouse: "Новосибирск (Сибирский)",
    status: "DRAFT",
    scanned_count: 0,
    total_items: 60,
    created_at: "2024-01-17T09:15:00Z",
    items: [
      { id: 41, product_name: "Принтер лазерный HP", label_code: "HP-LJ-041", scanned: false },
      { id: 42, product_name: "Картридж HP 26A", label_code: "HP-CR-042", scanned: false },
      { id: 43, product_name: "Бумага A3 (пачка)", label_code: "PPR-A3-043", scanned: false },
      { id: 44, product_name: "Шредер офисный", label_code: "SHR-044", scanned: false },
      { id: 45, product_name: "Ламинатор A4", label_code: "LAM-045", scanned: false }
    ]
  },
  {
    id: 4,
    order_number: "ORD-2024-004",
    source_warehouse: "Екатеринбург (Уральский)",
    target_warehouse: "Краснодар (Южный)",
    status: "DRAFT",
    scanned_count: 0,
    total_items: 25,
    created_at: "2024-01-18T11:45:00Z",
    items: [
      { id: 46, product_name: "Кофемашина офисная", label_code: "COF-046", scanned: false },
      { id: 47, product_name: "Зерна кофе 1кг", label_code: "COF-BN-047", scanned: false },
      { id: 48, product_name: "Чайный набор", label_code: "TEA-048", scanned: false },
      { id: 49, product_name: "Кулер для воды", label_code: "CLR-049", scanned: false },
      { id: 50, product_name: "Стаканы одноразовые", label_code: "CUP-050", scanned: false }
    ]
  }
];

export const mockCompletedOrders = [
  {
    id: 100,
    order_number: "ORD-2024-098",
    source_warehouse: "Москва (Центральный)",
    target_warehouse: "Воронеж (Черноземье)",
    status: "COMPLETED",
    scanned_count: 20,
    total_items: 20,
    created_at: "2024-01-10T08:00:00Z",
    completed_at: "2024-01-10T16:30:00Z"
  },
  {
    id: 101,
    order_number: "ORD-2024-097",
    source_warehouse: "Ростов-на-Дону (Южный)",
    target_warehouse: "Волгоград (Поволжье)",
    status: "COMPLETED",
    scanned_count: 35,
    total_items: 35,
    created_at: "2024-01-09T10:00:00Z",
    completed_at: "2024-01-09T18:15:00Z"
  },
  {
    id: 102,
    order_number: "ORD-2024-096",
    source_warehouse: "Нижний Новгород (Поволжье)",
    target_warehouse: "Самара (Поволжье)",
    status: "COMPLETED",
    scanned_count: 15,
    total_items: 15,
    created_at: "2024-01-08T12:00:00Z",
    completed_at: "2024-01-08T15:45:00Z"
  }
];

// Мок-ответы для сканирования
export const mockScanResponses = {
  // Успешное сканирование
  success: {
    status: 'SUCCESS',
    product_name: 'Товар',
    message: 'Можно грузить. Склад: Целевой'
  },
  
  // Ошибка - товар не в заявке
  error: {
    status: 'ERROR',
    product_name: 'Неизвестный товар',
    message: 'Этот товар не найден в заявке. Проверьте заявку #ORD-2024-001'
  },
  
  // Предупреждение - товар уже отсканирован
  warning: {
    status: 'WARNING',
    product_name: 'Товар',
    message: 'Этот товар уже был отсканирован ранее'
  }
};

// Генерация случайного ответа для тестирования
export const getRandomScanResponse = (decodedText) => {
  const random = Math.random();
  
  if (random < 0.7) {
    // 70% успешных
    return {
      status: 'SUCCESS',
      product_name: `Товар: ${decodedText}`,
      message: 'Можно грузить. Склад: Целевой'
    };
  } else if (random < 0.85) {
    // 15% предупреждений
    return {
      status: 'WARNING',
      product_name: `Товар: ${decodedText}`,
      message: 'Этот товар уже был отсканирован ранее'
    };
  } else if (random < 0.95) {
    // 10% ошибок
    return {
      status: 'ERROR',
      product_name: `Товар: ${decodedText}`,
      message: 'Этот товар не найден в заявке'
    };
  } else {
    // 5% критические ошибки
    return {
      status: 'ERROR',
      product_name: 'Ошибка',
      message: 'Поврежден QR-код. Отсканируйте повторно или введите код вручную'
    };
  }
};

// Функция для имитации задержки сети
export const simulateNetworkDelay = (ms = 300) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};