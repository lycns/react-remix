import { rexIf } from '../../index.macro'

const a = 1
rexIf(a === 1)(2)

function Comp() {
    rexIf(a === 1 || a === 2)(3)
}

const Comp2 = () => {
    rexIf(a === 1)(4)
}
