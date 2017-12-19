import React from 'react';
import PropTypes from 'prop-types';

import { Table } from 'semantic-ui-react'

import Expandable_Table from '../Reusable/Table/Expandable_Table';
import RestVerbHeaderComponent from './RestVerbHeaderComponent';
import RestRequestComponent from './RestRequestComponent';
import RestResponsesComponent from './RestResponsesComponent';
import RestRequestBodyComponent from './RestRequestBodyComponent'
import FhirConstant from '../../Constants/FhirConstant';

class RestPostComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {    
        const VerbGetName = 'POST';
        const _VerbColor = 'green';
        const _Description = `Add a ${this.props.resourceName} resource to the server`;
        const _Path = this.props.resourceName;
        const _VerbGetHttpHeaders = [
            { name: 'Content-Type', value: 'application/fhir+xml', moreInfo: `${FhirConstant.STU3_SpecWebsite}/http.html#mime-type` },
            { name: 'Accept', value: 'application/fhir+xml', moreInfo: `${FhirConstant.STU3_SpecWebsite}/http.html#mime-type` },
            { name: 'If-None-Exist', value: '[search parameters]', moreInfo: `${FhirConstant.STU3_SpecWebsite}/http.html#ccreate` }            
        ];
        
        const renderGetSearchTableBody = (Expand) => {
            if (Expand) {                
                return (
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell colSpan='16'>{_Description}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell colSpan='16'>
                                <RestRequestComponent resourceName={this.props.resourceName} httpHeaders={_VerbGetHttpHeaders} searchParameters={this.props.searchParameters} color={_VerbColor} />
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell colSpan='16'>
                                <RestResponsesComponent color={_VerbColor} />
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell colSpan='16'>
                                <RestRequestBodyComponent  resourceName={this.props.resourceName} color={_VerbColor} />
                            </Table.Cell>
                        </Table.Row>                        
                    </Table.Body>
                )
            } else {
                return null;
            }
        };

        const renderTableHeader = (Verb, Color, Path) => {
            return (
                <RestVerbHeaderComponent
                    verb={Verb}
                    color={Color}
                    path={Path}
                />
            )
        };

        return (
            <Expandable_Table
                tableHeadingComponent={renderTableHeader(VerbGetName, _VerbColor, _Path)}
                tableHeadingTitle={VerbGetName}
                tableColorType={_VerbColor}
                tableColorInverted={false}
                tableRowsFunction={renderGetSearchTableBody}
            />
        )
    }

}
//Type Checking
RestPostComponent.propTypes = {    
    resourceName: PropTypes.string.isRequired,
    searchParameters: PropTypes.array
}

RestPostComponent.defaultProps = {
}

export default RestPostComponent;  
