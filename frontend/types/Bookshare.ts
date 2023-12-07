interface Bookshare {
  title: string;
  authorId: number;
  bookshareAddr: string;
  imageBookshare: Blob;
  nbOfShares: number | undefined;
  totalSharedPercentage: number;
  supply: {
    available: number;
    total: number;
  };
  price: {
    amount: number;
    percentage: number;
  };
  releaseDate: string;
  royalties: string;
  lastPayOutDate: string;
  lastPayOut: string | number;
  totalPayOut: string | number;
}

export default Bookshare;
