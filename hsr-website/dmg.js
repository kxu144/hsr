function effDMG(multiplier, stat, crate, cdmg, elemDmg, flatDmg, bonusDmg_) {
    return (multiplier * stat + flatDmg) * (1 + elemDmg + bonusDmg_) * (1 + crate * cdmg);
}

function evalDMG(conf) {
    
}