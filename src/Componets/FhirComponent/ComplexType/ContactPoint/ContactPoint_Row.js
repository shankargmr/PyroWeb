import React from 'react';
import PropTypes from 'prop-types';
import ContactUse_Label from './ContactUse_Label'
import ContactSystem_Label from './ContactSystem_Label'
import Period_Label from '../Period_Label'
import Rank_Label from './Rank_Label'
import WebLink from '../../../Reusable/WebLink/WebLink'

import { Table } from 'semantic-ui-react'

class ContactPoint_Row extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        const resolveContactValueType = (Value, System) => {
            switch (System) {
                case 'phone':                                       
                    return <WebLink url={Value} display={Value} linkType={WebLink.LinkType.callTo} />
                case 'fax':
                    return <WebLink url={Value} display={Value} linkType={WebLink.LinkType.fax} />                        
                case 'email':
                    return <WebLink url={Value} display={Value} linkType={WebLink.LinkType.mailto} />                            
                case 'pager':
                    return <p>{Value}</p>
                case 'url':
                    return <WebLink url={Value} display={Value} linkType={WebLink.LinkType.webLink} />                                
                case 'sms':
                    return <WebLink url={Value} display={Value} linkType={WebLink.LinkType.sms} />                        
                case 'other':
                    return <p>{Value}</p>
                default:
                    return <p>{Value}</p>
            }

        };   
        const contactValue = (Value, System) => {
            return (
                Value &&
                resolveContactValueType(Value, System)                
            )
        };

        return (
            <Table.Row>
                <Table.Cell  width='5' textAlign='left'>
                    <ContactUse_Label use={this.props.use} />
                    <ContactSystem_Label system={this.props.system} />
                    <Rank_Label number={this.props.rank}/>
                </Table.Cell>
                <Table.Cell textAlign='left'>
                    <span>{contactValue(this.props.value, this.props.system)}</span>
                </Table.Cell>
                <Table.Cell width='2' textAlign='right'>
                    <Period_Label period={this.props.period} />
                </Table.Cell>
            </Table.Row>
        )
    }

}
//Type Checking
ContactPoint_Row.propTypes = {    
    system: PropTypes.string,
    value: PropTypes.string,
    use: PropTypes.string,
    rank: PropTypes.number,
    period: PropTypes.object,
}

export default ContactPoint_Row
