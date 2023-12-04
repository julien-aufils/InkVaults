interface Bookshare {
  title: string;
  authorId: number;
  imageBookshare: Blob;
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
