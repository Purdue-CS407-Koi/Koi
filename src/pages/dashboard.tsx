import { useBuckets } from "../hooks/useBuckets";
import { useBucketStore } from "../stores/useBucketStore";

export const Dashboard = () => {
  const { bucketData, isLoading, error } = useBuckets();
  const currentBucketId = useBucketStore((state) => state.currentBucketId);
  const setCurrentBucketId = useBucketStore(
    (state) => state.setCurrentBucketId
  );

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (error) {
    return <span>Error: {error.message}</span>;
  }

  const onClick = () => {
    if (currentBucketId == "1") {
      setCurrentBucketId("2");
    } else {
      setCurrentBucketId("1");
    }
  };

  // We can assume by this point that `isSuccess === true`
  return (
    <div>
      <p>The current bucket is: {bucketData!.name}</p>
      <button onClick={onClick}>Change bucket</button>
    </div>
  );
};
