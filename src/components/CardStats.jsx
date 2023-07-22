
import React from "react";
import { NavLink } from "react-router-dom";

function CardStats({ namaPoli, Link }) {
    return (
        <div className="w-[218px] bg-[#FFFFFF] shadow-lg rounded-lg border border-gray-200">
            <div
                className='flex justify-center items-center p-[22px]'>
                <div>
                    <NavLink
                        to={Link}
                        className={({ isActive }) =>
                            isActive
                                ? "font-source-sans font-normal text-[16px] text-center text-blue-500"
                                : "font-source-sans font-normal text-[16px] text-center"
                        }>
                        <p>{namaPoli}</p>
                    </NavLink>
                </div>
            </div>
        </div>
    );
}

export default CardStats;