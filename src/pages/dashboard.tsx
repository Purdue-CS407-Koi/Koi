import useBucketInstances from "../hooks/useBucketInstances";
import { useBucketInstanceStore } from "../stores/useBucketInstanceStore";

export const Dashboard = () => {
  const { bucketData, isLoading, error } = useBucketInstances();
  const currentBucketInstanceId = useBucketInstanceStore((state) => state.currentBucketInstanceId);
  const setCurrentBucketInstanceId = useBucketInstanceStore(
    (state) => state.setCurrentBucketInstanceId
  );

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (error) {
    return <span>Error: {error.message}</span>;
  }

  const onClick = () => {
    // if (currentBucketId == "1") {
    //   setCurrentBucketId("2");
    // } else {
    //   setCurrentBucketId("1");
    // }
  };

  // We can assume by this point that `isSuccess === true`
  return (
    <div>
      <p>The current bucket is: {bucketData!.id}</p>
      <button onClick={onClick}>Change bucket</button>
    </div>
  );
};
