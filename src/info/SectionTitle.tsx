import React from 'react';
import { MathComponent } from "mathjax-react";

export type SectionTitleProps = {
    title: string;
}
export const SectionTitle = function({ title }: SectionTitleProps) {
    return (
        <div className="SectionTitle">
            <div className="SectionTitle__line"></div>
            <h3>{title}</h3>
            <div className="SectionTitle__line"></div>
        </div>
    );
}