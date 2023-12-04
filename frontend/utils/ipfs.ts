// /utils/ipfs.js

const fetchFromIPFS = async (ipfsLink: string) => {
  try {
    // Extraction de la partie après 'ipfs://'
    const cid = ipfsLink.split("ipfs://")[1];

    const metadataResponse = await fetch(
      `https://ipfs.io/ipfs/${cid}/metadata.json`
    );
    const metadata = await metadataResponse.json();

    const imageResponse = await fetch(
      `https://ipfs.io/ipfs/${cid}/bookshare.png`
    );
    const imageBookshare = await imageResponse.blob();

    return { metadata, imageBookshare };
  } catch (error) {
    console.error("Error :", error);
    throw error;
  }
};

export { fetchFromIPFS };
