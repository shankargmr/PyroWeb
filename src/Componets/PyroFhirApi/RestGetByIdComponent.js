import React from 'react';
import PropTypes from 'prop-types';
import isNil from 'lodash/isNil';
import { Table } from 'semantic-ui-react';

import Expandable_Table from '../Reusable/Table/Expandable_Table';
import RestVerbHeaderComponent from './RestVerbHeaderComponent';
import RestHttpStatusComponent from './RestHttpStatusComponent';
import FhirResourceExampleGenerator from './FhirResourceExampleGenerator';
import ResponseComponent from './ResponseComponent';
import RequestComponent from './RequestComponent';
import RestHttpHeadersComponent from './RestHttpHeadersComponent';
import RestBodyComponent from './RestBodyComponent';

import UuidSupport from '../../SupportTools/UuidSupport';
import DateTimeSupport from '../../SupportTools/DateTimeSupport';
import FhirConstant from '../../Constants/FhirConstant';
import HttpConstant from '../../Constants/HttpConstant';
import FormatSupport from '../../SupportTools/FormatSupport';
// import far from 'react-syntax-highlighter/styles/hljs/far';

export default class RestGetByIdComponent extends React.Component {

    static propTypes = {
        resourceName: PropTypes.string.isRequired,
        endpointUrl: PropTypes.string.isRequired,
        contentTypeElement: PropTypes.element.isRequired,
        acceptElement: PropTypes.element.isRequired,
        acceptResponseElement: PropTypes.element.isRequired,

    }

    static defaultProps = {
    }

    constructor(props) {
        super(props);
    }

    render() {

        const VerbGetName = 'GET';
        const _VerbGetColor = 'blue';
        const PathSyntax = `${this.props.resourceName}/[id]`
        const GUID = UuidSupport.createGUID();
        const LastModified = DateTimeSupport.NowMomentDefault;
        const ResourceResponseVersion = 3;
        // ================= Request Setup ===========================================================

        const getRequestExampleURL = () => {
            return (
                <code>
                    <p>{`[Endpoint URL]/${this.props.resourceName}/${GUID}`}</p>
                </code>
            )
        }

        const getRequestHttpHeadersComponent = () => {
            if (!isNil(FhirConstant.GetRequestHeaders) && FhirConstant.GetRequestHeaders.length != 0) {
                return (
                    <RestHttpHeadersComponent
                        httpHeaders={FhirConstant.GetRequestByIdHeaders}
                        contentTypeElement={this.props.contentTypeElement}
                        acceptElement={this.props.acceptElement}
                        color={'violet'} />
                )
            } else {
                return null;
            }
        };


        // ================= Response Setup ===========================================================

        const getBodyOkExampleResource = (FormatType) => {
            if (FormatType === FormatSupport.FormatType.JSON) {
                return FhirResourceExampleGenerator.getJsonResource(this.props.resourceName, GUID, ResourceResponseVersion.toString(), LastModified);
            } else if (FormatType === FormatSupport.FormatType.XML) {
                return FhirResourceExampleGenerator.getXmlResource(this.props.resourceName, GUID, ResourceResponseVersion.toString(), LastModified);
            } else {
                return `SyntaxLanguage was ${FormatType.toString()}, can not create example resource`;
            }
        }

        const getBodyBadRequestExampleResource = (FormatType) => {
            if (FormatType === FormatSupport.FormatType.JSON) {
                return FhirResourceExampleGenerator.getJsonOperationOutcome();
            } else if (FormatType === FormatSupport.FormatType.XML) {
                return FhirResourceExampleGenerator.getXmlOperationOutcome();
            } else {
                return `SyntaxLanguage was ${FormatType.toString()}, can not create example ${FhirConstant.OperationOutcomeResourceName} resource`;
            }
        }

        const getResponseBodyOkComponent = (Color) => {
            const FormatRequired = FormatSupport.resolveFormatFromString(this.props.acceptResponseElement.props.value)
            return (
                <RestBodyComponent
                    userMessage={<p>{`The ${this.props.resourceName} resource for the Resource Id requested`}</p>}
                    resourceName={this.props.resourceName}
                    isBundleResource={false}
                    formatType={FormatRequired}
                    resourceData={getBodyOkExampleResource(FormatRequired)}
                    color={Color}
                />
            )

        }

        const getResponseBodyBadRequestComponent = (Color) => {
            const FormatRequired = FormatSupport.resolveFormatFromString(this.props.acceptResponseElement.props.value)
            return (
                <RestBodyComponent
                    exampleMessage={<p>{`An ${FhirConstant.OperationOutcomeResourceName} resource containing information about the error that has occured.`}</p>}
                    resourceName={FhirConstant.OperationOutcomeResourceName}
                    isBundleResource={false}
                    formatType={FormatRequired}
                    resourceData={getBodyBadRequestExampleResource(FormatRequired)}
                    color={Color}
                />
            )

        }

        const getResponseOkHeadersComponent = (Color) => {
            return (
                <RestHttpHeadersComponent
                    httpHeaders={FhirConstant.postResponseHeaders(this.props.endpointUrl, this.props.resourceName, GUID, LastModified, ResourceResponseVersion)}
                    contentTypeElement={this.props.acceptResponseElement}
                    acceptElement={null}
                    color={Color}
                />
            )
        }

        const getResponseBadRequestHeadersComponent = (Color) => {
            return (
                <RestHttpHeadersComponent
                    httpHeaders={FhirConstant.responseOperationOutcomeHeaders()}
                    contentTypeElement={this.props.acceptResponseElement}
                    acceptElement={null}
                    color={Color}
                />
            )
        }

        const getResponseGoneRequestHeadersComponent = (Color) => {
            return (
                <RestHttpHeadersComponent
                    httpHeaders={FhirConstant.responseGoneHeaders(ResourceResponseVersion.toString())}
                    contentTypeElement={this.props.acceptResponseElement}
                    acceptElement={null}
                    color={Color}
                />
            )
        }

        const getStatusOKComponent = () => {
            const HttpStatus = HttpConstant.getStatusCodeByNumber('200');
            return (
                <RestHttpStatusComponent
                    userMessage={<div>
                        <p>The request was successful and an {this.props.resourceName} resource with the resource [id] requested is returned.</p>
                    </div>}
                    statusNumber={HttpStatus.number}
                    statusText={HttpStatus.description}
                    statusColor={HttpStatus.color}
                    headerComponent={getResponseOkHeadersComponent(HttpStatus.color)}
                    bodyComponent={getResponseBodyOkComponent(HttpStatus.color)}
                />
            )

        }

        const getStatusBadRequestComponent = () => {
            const HttpStatus = HttpConstant.getStatusCodeByNumber('400');
            return (
                <RestHttpStatusComponent
                    userMessage={<div>
                        <p>Some form of error has occured with the request. An {FhirConstant.OperationOutcomeResourceName} resource will be return indicating what went wrong.</p>
                    </div>}
                    statusNumber={HttpStatus.number}
                    statusText={HttpStatus.description}
                    statusColor={HttpStatus.color}
                    headerComponent={getResponseBadRequestHeadersComponent(HttpStatus.color)}
                    bodyComponent={getResponseBodyBadRequestComponent(HttpStatus.color)}
                />
            )

        }

        const getStatusNotFoundRequestComponent = () => {
            const HttpStatus = HttpConstant.getStatusCodeByNumber('404');
            return (
                <RestHttpStatusComponent
                    userMessage={<div>
                        <p>The resource with the requested <code>[id]</code> is not found in the FHIR server.</p>
                        <p>As this server supports history it can report the differance between a resource it has never seen, this case,
                            and a resource it has seen yet was later deleted. In the later case you will receive a http status code of <code>[410 - Gone]</code>. </p>
                    </div>}
                    statusNumber={HttpStatus.number}
                    statusText={HttpStatus.description}
                    statusColor={HttpStatus.color}
                // headerComponent={getResponseBadRequestHeadersComponent(HttpStatus.color)}
                // bodyComponent={getResponseBodyBadRequestComponent(HttpStatus.color)}
                />
            )
        }

        const getStatusGoneRequestComponent = () => {
            const HttpStatus = HttpConstant.getStatusCodeByNumber('410');
            const PriorResourceResponseVersion = ResourceResponseVersion - 1;
            return (
                <RestHttpStatusComponent
                    userMessage={<div>
                        <p>The resource with the <code>[id]</code> requested has been deleted from the FHIR server.
                        As this server supports history the server knows it has receved this resource in the past yet its current status is deleted.</p>

                        <p>This response&#39;s header contains an <code>ETag</code> indicating the deleted instance version number. You could retrive the older deleted
                    resource instance&#39;s by performing an <code>[endpoint]/{PathSyntax}/_history/[vid]</code> request where <code>[vid]</code> would be
                        any of the prior versions. For instance, given this example, version <code>[{PriorResourceResponseVersion.toString()}]</code> would retrive the last instance before deletion whereas version <code>[{ResourceResponseVersion.toString()}]</code>, the most current version is the version instance that performed the deleteion and therefore contain no resource.</p>
                    </div>}
                    statusNumber={HttpStatus.number}
                    statusText={HttpStatus.description}
                    statusColor={HttpStatus.color}
                    headerComponent={getResponseGoneRequestHeadersComponent(HttpStatus.color)}
                // bodyComponent={getResponseBodyBadRequestComponent(HttpStatus.color)}
                />
            )
        }

        const getStatusComponentArray = () => {
            const OK = getStatusOKComponent();
            const NotFound = getStatusNotFoundRequestComponent();
            const Gone = getStatusGoneRequestComponent();
            const Bad = getStatusBadRequestComponent();
            return { OK, NotFound, Gone, Bad }
        }



        // ================= Render Table Body Setup ===========================================================


        const renderGetByIdComponentBody = (Expand) => {
            if (Expand) {
                const StatusComponentArray = getStatusComponentArray();
                const description = `Return a ${this.props.resourceName} resources with the Resource [id] equal to the id given in the request URL `;
                return (
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell colSpan='16'>{description}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell colSpan='16'>
                                <RequestComponent
                                    exampleComponet={getRequestExampleURL()}
                                    headersComponent={getRequestHttpHeadersComponent()}
                                    // SearchParametersComponent={getRequestSearchParametersComponent()}
                                    bodyComponent={null}
                                />
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell colSpan='16'>
                                <ResponseComponent
                                    statusComponentArray={StatusComponentArray}
                                />
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
                tableHeadingComponent={renderTableHeader(VerbGetName, _VerbGetColor, PathSyntax)}
                tableHeadingTitle={VerbGetName}
                tableColorType={_VerbGetColor}
                tableColorInverted={false}
                tableRowsFunction={renderGetByIdComponentBody}
            />
        )
    }

}
