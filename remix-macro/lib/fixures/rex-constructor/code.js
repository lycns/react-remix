import { rexConstructor } from '../../index.macro'

const [props = {}] = rexConstructor()

export default __REX_COMPONENT__

function __REX_COMPONENT__() {
    const { a }  = props
}