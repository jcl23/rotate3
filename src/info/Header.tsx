// a fixed header that contains a title and some information
import React from 'react';
import { MathComponent } from "mathjax-react";

// No props, just hardcode everything
// The header should be above everything else, and push other stuff down if nessecary.
export const Header = function() {
    return (
        <div className="Header">
            <h1>Subgroup Diagrams</h1>
            <p>
                This is a demonstration of the automorphism groups of regular polyhedra, particularly, the five platonic solids. Select a subgroup to focus on a particular sub-symmetry of the focused object. 
            </p>
        </div>
    );
}
