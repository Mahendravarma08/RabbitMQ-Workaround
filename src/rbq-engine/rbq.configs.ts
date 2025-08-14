export enum Exchanges {
  DIRECT_EXCHANGE = 'Direct_exchange',
  FANOUT_EXCHANGE = 'Fanout_exchange',
  TOPIC_EXCHANGE = 'Topic_exchange'
}

export enum Exchange_type {
    DIRECT = 'direct',
    FANOUT = 'fanout',
    TOPIC = 'topic'
}

export enum Queues {
  Orders = 'Orders',
  Notifications = 'Notifications',
  Analytics = 'Analytics',
  Invoice = 'Invoice'
}

export enum RoutingKeys {
  ORDERS_ROUTING_KEY = 'Orders',
  NOTIFICATION_ROUTING_KEY = 'Notifications',
  ORDER_PLACED_NOTIFY_ROUTING_KEY = 'Orders.notify.sendInvoice'
}
