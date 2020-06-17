const { createMacro } = require('babel-plugin-macros')

module.exports = createMacro(({ references, state, babel }) => {
    const { rexIf = [], rexConstructor = [], rexProps = [] } =  references
    rexIf.forEach(path => {
        const funPath = path.getFunctionParent()
        // 判断调用环境是否在 function 中
        if (!(babel.types.isFunctionDeclaration(funPath) || 
            babel.types.isArrowFunctionExpression(funPath))) {
            // 如果不是在 function 中调用，则删除此节点
            path.getStatementParent().remove()
            return
        }
        // 生成目标 AST 的对应结构并替换当前节点
        path.getStatementParent().replaceWith(babel.types.ifStatement(
            path.parent.arguments[0],
            babel.types.blockStatement([
                babel.types.returnStatement(
                    path.parentPath.parent.arguments[0]
                )
            ])
        ))
    })
    rexConstructor.forEach(path => {
        const funPath = path.getFunctionParent()
        // 判断调用环境是否在 program 中
        if (!babel.types.isProgram(funPath)) {
            // 如果不是在 program 中调用，则删除此节点
            path.getStatementParent().remove()
            return
        }
        const paramNode = path.parentPath.parentPath.get('id').node
        // 暂时只支持结构赋值的方式取 props
        if (!babel.types.isArrayPattern(paramNode)) {
            return
        }
        const [propsNode, funNode] = paramNode.elements
        // 替换 fun 中的内容
        funPath.traverse({
            FunctionDeclaration(fpath) {
                // 如果根节点的 fun 是自定义标示的 __REX_COMPONENT__，则进行替换
                if (fpath.get('id').node.name === '__REX_COMPONENT__') {
                    if (funNode) {
                        fpath.get('id').node.name = funNode.name
                    }
                    if (propsNode) {
                        fpath.node.params = [propsNode]
                    }
                }
            }
        })
        path.getStatementParent().remove()
    })
    rexProps.forEach(path => {
        const funPath = path.getFunctionParent()
        // 判断调用环境是否在 function 中
        if (!(babel.types.isFunctionDeclaration(funPath) || 
            babel.types.isArrowFunctionExpression(funPath))) {
            // 如果不是在 function 中调用，则删除此节点
            path.getStatementParent().remove()
            return
        }
        funPath.node.params = [path.parentPath.parent.id]
        path.getStatementParent().remove()
    })
})