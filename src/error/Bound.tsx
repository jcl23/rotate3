// an error boundary which displays an appropriately styled message

import React from 'react';
import { MathComponent } from "mathjax-react";

// Should just catch errors and display a message
type BoundProps = {
    children: React.ReactNode;
}
type BoundState = {
    hasError: boolean;
}
export class Bound extends React.Component<BoundProps, BoundState> {
    constructor(props: BoundProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {

        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="Bound">
                    <h1>An error occured</h1>
                    <p>Something went wrong while rendering this component.</p>
                </div>
            );
        }

        return this.props.children;
    }
}