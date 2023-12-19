interface Props {
  code: string;
}
export default function (props: Props) {
  const { code } = props;
  return (
    <code>
      <pre>{code}</pre>
    </code>
  );
}
