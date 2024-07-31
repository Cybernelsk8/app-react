import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome"

const Button = ({text, className, icon}) => {


    return (
        <button className={'btn ' + className}>
            <div className="flex items-center gap-1">
                <Icon icon={icon} className="text-sm" />
                {text}
            </div>
        </button>
    )
}

export default Button