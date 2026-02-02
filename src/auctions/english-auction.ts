import { EventEmitter } from 'events';

interface EnglishAuctionConfig {
  startingPrice: number;
  reservePrice: number;
  bidIncrement: number;
  startTime: Date;
  endTime: Date;
  timeExtension?: number;
}

interface Bid {
  bidderId: string;
  amount: number;
  timestamp: Date;
}

export class EnglishAuction extends EventEmitter {
  private config: EnglishAuctionConfig;
  private bids: Bid[] = [];
  private currentPrice: number;
  private status: 'pending' | 'active' | 'ended' = 'pending';
  private endTime: Date;

  constructor(config: EnglishAuctionConfig) {
    super();
    this.config = config;
    this.currentPrice = config.startingPrice;
    this.endTime = config.endTime;
  }

  placeBid(bidderId: string, amount: number): { success: boolean; message: string } {
    if (this.status !== 'active') {
      return { success: false, message: 'Auction is not active' };
    }

    const minBid = this.currentPrice + this.config.bidIncrement;
    if (amount < minBid) {
      return { success: false, message: `Bid must be at least ${minBid}` };
    }

    const currentHighestBidder = this.getHighestBidder();
    if (currentHighestBidder?.bidderId === bidderId) {
      return { success: false, message: 'You are already the highest bidder' };
    }

    const bid: Bid = { bidderId, amount, timestamp: new Date() };
    this.bids.push(bid);
    this.currentPrice = amount;

    // Check if time extension is needed
    if (this.config.timeExtension) {
      const timeUntilEnd = this.endTime.getTime() - Date.now();
      if (timeUntilEnd < 60000) {
        this.endTime = new Date(this.endTime.getTime() + this.config.timeExtension * 1000);
        this.emit('timeExtended', this.endTime);
      }
    }

    this.emit('bidPlaced', bid);
    this.emit('priceUpdated', this.currentPrice);
    return { success: true, message: 'Bid placed successfully' };
  }

  getHighestBidder(): Bid | null {
    if (this.bids.length === 0) return null;
    return this.bids.reduce((highest, bid) => (bid.amount > highest.amount ? bid : highest));
  }

  start(): void {
    if (Date.now() < this.config.startTime.getTime()) {
      throw new Error('Cannot start auction before start time');
    }
    this.status = 'active';
    this.emit('started');
  }

  end(): { winner: string | null; finalPrice: number } {
    this.status = 'ended';
    const highestBid = this.getHighestBidder();

    if (!highestBid || highestBid.amount < this.config.reservePrice) {
      this.emit('ended', { winner: null, finalPrice: 0 });
      return { winner: null, finalPrice: 0 };
    }

    const result = { winner: highestBid.bidderId, finalPrice: highestBid.amount };
    this.emit('ended', result);
    return result;
  }

  getBids(): Bid[] {
    return [...this.bids];
  }

  getCurrentPrice(): number {
    return this.currentPrice;
  }

  getStatus(): string {
    return this.status;
  }
}
