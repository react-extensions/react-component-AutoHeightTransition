import React, { Component } from 'react';
import PropTypes from 'prop-types'
import requestAnimationFrameExact from './requestAnimationFrameExact.js'

/**
 * 检测浏览器是否支持 transitionend 事件
 */
let isSupport = false;
(function check() {
    const div = document.createElement('div')
    div.style = 'transition:opacity ease 1ms;opacity:1'
    const fn = () => { isSupport = true; }
    div.addEventListener('transitionend', fn)
    document.body.appendChild(div)
    setTimeout(() => {
        div.style = 'transition:opacity ease 1ms;opacity:0'
        setTimeout(() => {
            div.removeEventListener('transitionend', fn)
            document.body.removeChild(div)
        }, 1000)
    }, 0)

})()



class TransitionWhenToggle extends Component {
    constructor(props) {
        super(props)

        this.state = {
            children: props.children,
            style: {
                position: 'fixed',
                visibility: 'hidden',
                zIndex: '-9999'
            },
        }

        this.el = { current: null }

        this.handleTransitionEnd = this.handleTransitionEnd.bind(this)

    }
    componentDidMount() {
        if (this.state.children) {
            this.show()
        }
    }

    UNSAFE_componentWillReceiveProps(nextP) {
        if (!!this.props.children !== !!nextP.children) {
            //   clearTimeout(this.afterShowTimer)
            clearTimeout(this.afterTransitionEndTimer)
            // 显示
            if (nextP.children) {

                // 当元素正在隐藏的时候， 又被切换成显示
                // 此时需要记录当前高度，并从此高度过渡到完全显示
                if (this.isHiding) {
                    this.isHiding = false
                    this.currentHeightWhenHide = this.el.current.clientHeight
                }
                // 将元素设为不可见，
                // 并且设为fixed，让其不影响布局，且会完全展开高度，
                // 这样就能正确获取到其完整高度

                // 已知问题： 当元素正在隐藏时，又马上切换显示
                // 设置此样式时应该会导致塌陷， 但是实际测试中并没有发现此问题
                this.setState({
                    children: nextP.children,
                    style: {
                        position: 'fixed',
                        visibility: 'hidden',
                        zIndex: '-9999'
                    }
                }, this.show)
            }
            // 隐藏
            else {
                this.hide()
            }
        }
    }
    show() {
        this.realHeight = this.el.current.clientHeight
        // 先设置初始状态
        this.setState({
            style: {
                height: this.currentHeightWhenHide || 0,
                transitionDuration: '0ms',
            }
        }, this.nextTickAfterShow)
    }

    nextTickAfterShow() {

        // this.afterShowTimer = setTimeout(() => {
        //   this.setState({
        //     style: { height: this.realHeight }
        //   })
        // },16)
        // this.time = +new Date()
        requestAnimationFrameExact(() => {
            // console.log(+new Date, this.time, +new Date - this.time)
            this.setState({
                style: { height: this.realHeight }
            })
        })
    }
    hide() {
        this.isHiding = true
        this.setState({
            style: { height: 0 }
        }, this.nextTickAfterHide)
    }
    nextTickAfterHide() {
        if (isSupport) return
        this.afterTransitionEndTimer = setTimeout(() => {
            this.setState({ children: null })
        }, this.props.duration)
    }
    handleTransitionEnd() {
        if (!isSupport || !this.isHiding) return
        this.isHiding = false
        this.setState({ children: null })
    }

    render() {
        if (!this.state.children) return null
        return (
            <div ref={this.el}
                style={Object.assign({
                    overflow: 'hidden',
                    transitionDuration: this.props.duration + 'ms',
                    transitionTimingFunction: this.props.timeFunction,
                    transitionProperty: 'height'
                }, this.state.style)}
                onTransitionEnd={this.handleTransitionEnd}
            >
                {this.state.children}
            </div>

        );
    }
}

TransitionWhenToggle.defaultProps = {
    duration: 600,
    timeFunction: 'ease'
}

TransitionWhenToggle.propTypes = {
    duration: PropTypes.number,
    timeFunction: PropTypes.string
}

export default TransitionWhenToggle;