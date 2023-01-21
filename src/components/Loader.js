import { Loader as Loading } from "react-feather";

const Loader = () => {
    return (
        <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]">
            <Loading className="animate-spin"/>
        </div>
    );
};

export default Loader;