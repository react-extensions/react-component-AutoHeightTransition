import React, { Component } from 'react';
import requestAnimationFrameExact from './requestAnimationFrameExact.js'
import PropTypes from 'prop-types'


class TransitionWhenHeightChange extends Component {
    constructor(props) {
        super(props)
        this.state = {
            style: { height: props.height },
            placeholderHeight: null
        }

        this.el = { current: null }
    }
    componentDidMount(){

    }
    UNSAFE_componentWillReceiveProps(nextP) {
        if (nextP.height !== this.props.height) {
            // 折叠
            if (nextP.height) {
                this.setState({
                    style: {
                        height: this.el.current.clientHeight,
                    }
                }, this.afterCollapse)

            }
            // 展开
            else {
                this.setState({
                    placeholderHeight: this.el.current.clientHeight,
                    style: {
                        height: null
                    }
                }, this.afterExpand)
            }
        }
    }
    afterExpand() {
        requestAnimationFrameExact(() => {
            const height = this.el.current.clientHeight
            this.setState({
                placeholderHeight: null,
                style: {
                    height: this.state.placeholderHeight,
                }
            }, () => {
                requestAnimationFrameExact(() => {
                    this.setState({
                        style: {
                            height: height,
                            transitionDuration: this.props.duration + 'ms',
                        }
                    })
                })
            })
        })
    }
    afterCollapse() {
        requestAnimationFrameExact(() => {
            this.setState({
                style: {
                    height: this.props.height,
                }
            })
        })
    }
    render() {
        const state = this.state;
        return (
            <div style={{
              height: state.placeholderHeight,
              overflow: 'hidden',
            }}>
                <div ref={this.el}
                     style={Object.assign({
                       transitionProperty: 'height',
                       overflow: 'hidden',
                       transitionDuration: this.props.duration + 'ms',
                       transitionTimingFunction: this.props.timeFunction
                     }, this.state.style)}
                >
                  {this.props.children}
                </div>
            </div>
        );
    }
}

TransitionWhenHeightChange.defaultProps = {
    duration: 300,
    timeFunction: 'ease'
}

TransitionWhenHeightChange.propTypes = {
    duration: PropTypes.number,
    timeFunction: PropTypes.string
}


export default TransitionWhenHeightChange;