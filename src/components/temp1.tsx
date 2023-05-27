const Button = (props: { onClick: () => void; value: string }) => (
  <button
    onClick={props.onClick}
    className="max-w-lg self-center rounded-3xl border-2 border-amber-600 bg-amber-600 px-2 py-1 text-slate-200 hover:bg-slate-200 hover:text-black "
  >
    {props.value}
  </button>
);

export default Button;
