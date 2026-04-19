import { render } from "solid-js/web";

const root = document.getElementById("root");
if (!root) {
	throw new Error("Mount point not found");
}

render(() => <div>Popup</div>, root);
