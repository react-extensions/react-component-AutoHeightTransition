# react-auto-height-transition
基于react的可自动过渡高度的transition组件

使用方法：

```jsx
import {
    TransitionWhenToggle,
    TransitionWhenHeightChange
} from 'react-auto-height-transition'

<TransitionWhenToggle duration={300} timeFunction={'ease'}>
  {
    this.state.show && (
      <div>
        placeholder<br/>
        placeholder<br/>
        placeholder<br/>
        placeholder<br/>
      </div>
    )
  }
</TransitionWhenToggle>

<TransitionWhenHeightChange height={this.state.shouldCollapsed ? 20 : null} duration={300} timeFunction={'ease'}>
    <div>
        placeholder<br/>
        placeholder<br/>
        placeholder<br/>
        placeholder<br/>
      </div>
</TransitionWhenHeightChange>

```
