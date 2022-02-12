interface AlertOptions {
    category?: ""|"primary"|"warning"|"danger"|"success"|"info",
    dismissible?: boolean,
    timeout?: number
}

const alert = (text : string, options? : AlertOptions) => {
    const div = document.createElement("div");
    div.innerText = text;

    div.classList.add("alert");
    if(options?.category?.length > 0) div.classList.add(options.category)

    if(options?.dismissible === true) {
        div.style.cursor = "pointer";
        div.onclick = () => {
            div.removeAttribute("shown");
            setTimeout(() => div.remove(), 200);
        }
    }

    if(typeof (options?.timeout ?? -1) === "number" && (options?.timeout ?? -1) >= 0) {
        setTimeout(() => {
            div.removeAttribute("shown");
            setTimeout(() => div.remove(), 200);
        }, (options?.timeout ?? 5000));
    }

    let alerts = [...document.body.querySelectorAll("div.alert")];
    document.body.append(div);
    setTimeout(() => div.setAttribute("shown", ""), 1);
    setTimeout(() => alerts.forEach(alert => alert.remove()), 200)
    return div;
}

export default alert;