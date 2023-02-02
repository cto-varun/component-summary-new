import React from 'react';
import withData from '../../../../../src/utils/withData';
import './styles.css';

const setAppropriateContent = (obj, data, props) => {
    if (!obj) {
        return '';
    }
    const { html = '', text = '', fn = '', child = '', styles = {} } = obj;
    if (html) {
        return (
            <div style={styles} dangerouslySetInnerHTML={{ __html: html }} />
        );
    }
    if (text) {
        return <div style={styles}>{text}</div>;
    }
    if (fn) {
        const result = new Function(`return ${fn}`)()(data || {});
        return (
            <div style={styles} dangerouslySetInnerHTML={{ __html: result }} />
        );
    }
    if (child) {
        return props.children && child in props.children ? (
            React.cloneElement(props.children[child], {
                parentProps: props,
            })
        ) : (
            <></>
        );
    }

    return <></>;
};

const mapData = (datum, data, props) => {
    return datum.map((item, index) => {
        if (typeof item === 'string') {
            return <div key={index}>{item}</div>;
        }

        return (
            <div key={index}>{setAppropriateContent(item, data, props)}</div>
        );
    });
};

const mapPayload = (payload, data, props) => {
    return payload.map((packet, index) => {
        return (
            <div
                className="payload-flex-row"
                style={packet.styles || {}}
                key={packet.id || index}
            >
                {mapData(packet.data || [], data, props)}
            </div>
        );
    });
};

const processItems = (items, data) => {
    return items.map((item) => {
        if (item.payload.use && data) {
            try {
                const payload = new Function(
                    `return function(d) { return d.${item.payload.use}; };`
                )()(data);

                return {
                    ...item,
                    payload,
                };
            } catch (e) {
                return [];
            }
        }
        return item;
    });
};

const mapSections = (sections, data, props) => {
    const items = processItems(sections.items || [], data);

    return (sections.transformations || [])
        .reduce((acc, trans) => {
            try {
                const func = new Function(`return ${trans}`)();
                return func(acc);
            } catch (e) {
                return acc;
            }
        }, items)
        .map((section) => {
            return (
                <div key={section.id}>
                    {setAppropriateContent(section.sectionTitle, data, props)}
                    <div className="payload-flex-wrapper">
                        {mapPayload(section.payload || [], data, props)}
                    </div>
                </div>
            );
        });
};

const loadFrom = (fn) => {
    try {
        return new Function(`return ${fn}`)()();
    } catch (e) {
        return undefined;
    }
};

const SummaryTable = (props) => {
    const { dataProcessor = {}, params = {} } = props.component;
    const structure =
        loadFrom(params.loadFromFunction) || params.structure || {};
    const accessor = dataProcessor.accessName;
    const data = { [accessor]: props[accessor] };

    if (structure === 'null') return null;

    if (params.static) {
        return (
            <div className="summary-table" style={structure.tableStyles}>
                {setAppropriateContent(
                    structure.summaryTitle || {},
                    null,
                    props
                )}
                {mapSections(structure.sections || {}, null, props)}
            </div>
        );
    }

    return data[accessor] ? (
        <div className="summary-table" style={structure.tableStyles}>
            {setAppropriateContent(structure.summaryTitle, data, props)}
            {mapSections(structure.sections, data, props)}
        </div>
    ) : (
        <></>
    );
};

export default withData(SummaryTable);
