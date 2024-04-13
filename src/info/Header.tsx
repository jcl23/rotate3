// a fixed header that contains a title and some information
import React from 'react';
import { MathComponent } from "mathjax-react";

// No props, just hardcode everything
// The header should be above everything else, and push other stuff down if nessecary.
export const Header = function() {
    return (
        <div className="Header">
            <h1>Rotation Groups and the 5 Platonic Solids</h1>
            
        </div>
    );
}
