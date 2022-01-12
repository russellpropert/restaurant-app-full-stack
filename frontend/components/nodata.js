export default function NoData({ data }) {
  return (
    <div className="main">
      <p className="description">
        There were no {data} found.
        Please try again later.
      </p>
    </div>
  );
}