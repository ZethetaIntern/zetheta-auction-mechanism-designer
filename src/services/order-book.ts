// Order Book Management Service
// Tracks and manages buy/sell orders in auction system

export interface Order {
  orderId: string;
  userId: string;
  auctionId: string;
  bidAmount: number;
  status: 'pending' | 'filled' | 'cancelled';
  timestamp: Date;
}

export interface OrderBook {
  auctionId: string;
  bids: Order[];
  asks: Order[];
  lastPrice: number;
  timestamp: Date;
}

export class OrderBookService {
  private orderBooks: Map<string, OrderBook> = new Map();
  private allOrders: Map<string, Order> = new Map();

  // Create or get order book for auction
  getOrderBook(auctionId: string): OrderBook {
    if (!this.orderBooks.has(auctionId)) {
      this.orderBooks.set(auctionId, {
        auctionId,
        bids: [],
        asks: [],
        lastPrice: 0,
        timestamp: new Date()
      });
    }
    return this.orderBooks.get(auctionId)!;
  }

  // Add buy order to order book
  addBid(orderId: string, userId: string, auctionId: string, bidAmount: number): Order {
    const order: Order = {
      orderId,
      userId,
      auctionId,
      bidAmount,
      status: 'pending',
      timestamp: new Date()
    };
    
    const orderBook = this.getOrderBook(auctionId);
    orderBook.bids.push(order);
    
    // Sort bids in descending order
    orderBook.bids.sort((a, b) => b.bidAmount - a.bidAmount);
    
    this.allOrders.set(orderId, order);
    return order;
  }

  // Get top bid price
  getTopBid(auctionId: string): number {
    const orderBook = this.getOrderBook(auctionId);
    if (orderBook.bids.length === 0) return 0;
    return orderBook.bids[0].bidAmount;
  }

  // Fill order when conditions are met
  fillOrder(orderId: string): boolean {
    const order = this.allOrders.get(orderId);
    if (!order) return false;
    
    order.status = 'filled';
    const orderBook = this.getOrderBook(order.auctionId);
    orderBook.lastPrice = order.bidAmount;
    orderBook.timestamp = new Date();
    
    return true;
  }

  // Cancel order
  cancelOrder(orderId: string): boolean {
    const order = this.allOrders.get(orderId);
    if (!order || order.status !== 'pending') return false;
    
    order.status = 'cancelled';
    const orderBook = this.getOrderBook(order.auctionId);
    
    // Remove from bids/asks arrays
    orderBook.bids = orderBook.bids.filter(o => o.orderId !== orderId);
    orderBook.asks = orderBook.asks.filter(o => o.orderId !== orderId);
    
    return true;
  }

  // Get price depth (volume at price levels)
  getPriceDepth(auctionId: string, levels: number = 10): any[] {
    const orderBook = this.getOrderBook(auctionId);
    const depth: any[] = [];
    
    const bidLevels = orderBook.bids.slice(0, levels);
    for (const bid of bidLevels) {
      depth.push({
        price: bid.bidAmount,
        quantity: 1,
        side: 'buy'
      });
    }
    
    return depth;
  }

  // Get order book snapshot
  getSnapshot(auctionId: string): OrderBook {
    return { ...this.getOrderBook(auctionId) };
  }
}

export default OrderBookService;
