const EraseButton = ({ clearDraw }) => {
    return (
        <button 
            onClick={clearDraw}
            className="w-full py-2 mt-2 text-lg font-semibold text-white bg-red-400 rounded-lg hover:bg-red-500"
        >
            Erase
        </button>
    );
};

export default EraseButton;