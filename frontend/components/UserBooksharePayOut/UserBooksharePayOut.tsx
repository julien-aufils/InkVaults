import React, { useEffect } from "react";
import { parseAbiItem } from "viem";
import { usePublicClient, useAccount } from "wagmi";
import Bookshare from "@/types/Bookshare";

interface UserBooksharePayOutProps {
  bookshare: Bookshare;
}

const UserBooksharePayOut: React.FC<UserBooksharePayOutProps> = ({
  bookshare,
}) => {
  const { address, isConnected } = useAccount();
  const client = usePublicClient();

  // const getTransactionsEvents = async () => {
  //   try {
  //     const events = await client.getLogs({
  //        address: bookshare.bookshareAddr,
  //        event: parseAbiItem(
  //          "event BookShareSold(address indexed buyer, uint256 amount)"
  //        ),
  //     });
  //     return events;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  useEffect(() => {
    const fetchData = async () => {
      const transactionsEvents = await getTransactionsEvents();
    };
    fetchData();
  }, []);

  return <div>UserBooksharePayOut</div>;
};

export default UserBooksharePayOut;
