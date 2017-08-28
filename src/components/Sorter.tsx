import * as React from 'react'

export type SortDirection = 'asc' | 'desc' | 'none'

interface Props {
    direction?: SortDirection
    onDirectionChange(direction: SortDirection): void
}

function getNextDirection(direction: SortDirection): SortDirection {
    switch (direction) {
        case 'asc': return 'desc'
        case 'desc': return 'none'
        case 'none': return 'asc'
        default: return 'none'
    }
}

function getClassName(direction: SortDirection): string {
    switch (direction) {
        case 'asc': return 'oi-sort-ascending'
        case 'desc': return 'oi-sort-descending'
        case 'none':
        default: return 'oi-list'
    }
}

export class Sorter extends React.Component<Props> {

    constructor(props) {
        super(props)

        this.handleChangeDirection = this.handleChangeDirection.bind(this)
    }

    handleChangeDirection() {
        const direction = getNextDirection(this.props.direction)
        this.props.onDirectionChange(direction)
    }

    render() {
        const { direction } = this.props

        return (
            <span className={`oi ${getClassName(direction)}`} onClick={this.handleChangeDirection} />
        )
    }
}