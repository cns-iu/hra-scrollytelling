/**
 * Validates the concise Story end-matter schema.
 *
 * @param {unknown} data Parsed JSON content
 * @returns {string[]} Validation issue messages
 */
export function validateEndMatter(data) {
    const issues = [];

    if (!isRecord(data)) {
        return ["root value must be an object"];
    }

    if (data.version !== 1) {
        issues.push("version must equal 1");
    }

    if (!data.resources && !data.acknowledgments && !data.references) {
        issues.push("at least one end-matter section is required");
    }

    validateResources(data.resources, issues);
    validateAcknowledgments(data.acknowledgments, issues);
    validateReferences(data.references, issues);

    return issues;
}

/**
 * Validates resource-card content.
 *
 * @param {unknown} resources Resources section
 * @param {string[]} issues Mutable issue list
 * @returns {void}
 */
function validateResources(resources, issues) {
    if (resources === undefined) {
        return;
    }

    if (!isRecord(resources)) {
        issues.push("resources must be an object");
        return;
    }

    requireString(resources.title, "resources.title", issues);
    requireOptionalString(resources.intro, "resources.intro", issues);

    if (!Array.isArray(resources.items) || resources.items.length === 0) {
        issues.push("resources.items must be a non-empty array");
        return;
    }

    resources.items.forEach((item, index) => {
        const field = `resources.items[${index}]`;

        if (!isRecord(item)) {
            issues.push(`${field} must be an object`);
            return;
        }

        requireString(item.eyebrow, `${field}.eyebrow`, issues);
        requireString(item.title, `${field}.title`, issues);
        requireString(item.description, `${field}.description`, issues);
        requireString(item.href, `${field}.href`, issues);

        if (item.newTab !== undefined && typeof item.newTab !== "boolean") {
            issues.push(`${field}.newTab must be a boolean when provided`);
        }
    });
}

/**
 * Validates acknowledgment content.
 *
 * @param {unknown} acknowledgments Acknowledgments section
 * @param {string[]} issues Mutable issue list
 * @returns {void}
 */
function validateAcknowledgments(acknowledgments, issues) {
    if (acknowledgments === undefined) {
        return;
    }

    if (!isRecord(acknowledgments)) {
        issues.push("acknowledgments must be an object");
        return;
    }

    requireString(acknowledgments.title, "acknowledgments.title", issues);
    requireOptionalString(acknowledgments.intro, "acknowledgments.intro", issues);

    if (!Array.isArray(acknowledgments.items) || acknowledgments.items.length === 0) {
        issues.push("acknowledgments.items must be a non-empty array");
    } else {
        acknowledgments.items.forEach((item, index) => {
            const field = `acknowledgments.items[${index}]`;

            if (!isRecord(item)) {
                issues.push(`${field} must be an object`);
                return;
            }

            requireString(item.label, `${field}.label`, issues);
            requireString(item.text, `${field}.text`, issues);
        });
    }

    if (acknowledgments.funding !== undefined) {
        if (!isRecord(acknowledgments.funding)) {
            issues.push("acknowledgments.funding must be an object");
        } else {
            requireString(acknowledgments.funding.label, "acknowledgments.funding.label", issues);
            requireString(acknowledgments.funding.text, "acknowledgments.funding.text", issues);
        }
    }

    if (acknowledgments.funders !== undefined) {
        if (!Array.isArray(acknowledgments.funders)) {
            issues.push("acknowledgments.funders must be an array");
        } else {
            acknowledgments.funders.forEach((funder, index) => validateFunder(funder, index, issues));
        }
    }
}

/**
 * Validates one funder entry.
 *
 * @param {unknown} funder Funder entry
 * @param {number} index Entry index
 * @param {string[]} issues Mutable issue list
 * @returns {void}
 */
function validateFunder(funder, index, issues) {
    const field = `acknowledgments.funders[${index}]`;

    if (!isRecord(funder)) {
        issues.push(`${field} must be an object`);
        return;
    }

    requireString(funder.name, `${field}.name`, issues);
    requireString(funder.logo, `${field}.logo`, issues);
    requireString(funder.href, `${field}.href`, issues);

    if (!Number.isInteger(funder.width) || !Number.isInteger(funder.height)) {
        issues.push(`${field}.width and .height must be integer source dimensions`);
    }
}

/**
 * Validates supported reference types and canonical DOI fields.
 *
 * @param {unknown} references References section
 * @param {string[]} issues Mutable issue list
 * @returns {void}
 */
function validateReferences(references, issues) {
    if (references === undefined) {
        return;
    }

    if (!isRecord(references)) {
        issues.push("references must be an object");
        return;
    }

    requireString(references.title, "references.title", issues);
    requireOptionalString(references.intro, "references.intro", issues);

    if (!Array.isArray(references.items) || references.items.length === 0) {
        issues.push("references.items must be a non-empty array");
        return;
    }

    references.items.forEach((item, index) => {
        const field = `references.items[${index}]`;

        if (!isRecord(item)) {
            issues.push(`${field} must be an object`);
            return;
        }

        if (!["journal-article", "preprint", "webpage"].includes(item.type)) {
            issues.push(`${field}.type must be journal-article, preprint, or webpage`);
        }

        if (!Array.isArray(item.authors) || item.authors.length === 0 || item.authors.some((author) => typeof author !== "string" || !author.trim())) {
            issues.push(`${field}.authors must contain every author as a non-empty string`);
        }

        requireString(item.title, `${field}.title`, issues);

        if (item.type === "journal-article") {
            requireString(item.containerTitle, `${field}.containerTitle`, issues);
            requireString(item.year, `${field}.year`, issues);
            requireString(item.volume, `${field}.volume`, issues);
            requireOptionalString(item.issue, `${field}.issue`, issues);
            requireOptionalString(item.pages, `${field}.pages`, issues);
            requireOptionalString(item.articleNumber, `${field}.articleNumber`, issues);
            requireOptionalString(item.date, `${field}.date`, issues);
        } else if (item.type === "preprint") {
            requireString(item.containerTitle, `${field}.containerTitle`, issues);
            requireString(item.date, `${field}.date`, issues);
        } else if (item.type === "webpage") {
            requireString(item.publisher, `${field}.publisher`, issues);
            requireString(item.date, `${field}.date`, issues);
            requireString(item.url, `${field}.url`, issues);
        }

        if (item.doi !== undefined && (typeof item.doi !== "string" || !/^10\.\d{4,9}\/.+/u.test(item.doi))) {
            issues.push(`${field}.doi must be a bare DOI beginning with 10.`);
        }

        if (item.type !== "webpage" && item.doi === undefined && item.url === undefined) {
            issues.push(`${field} must provide a DOI or stable URL`);
        }

        requireOptionalString(item.url, `${field}.url`, issues);
    });
}

/**
 * Validates a string only when it is provided.
 *
 * @param {unknown} value Candidate value
 * @param {string} field Field label for diagnostics
 * @param {string[]} issues Mutable issue list
 * @returns {void}
 */
function requireOptionalString(value, field, issues) {
    if (value !== undefined) {
        requireString(value, field, issues);
    }
}

/**
 * Requires a trimmed string value.
 *
 * @param {unknown} value Candidate value
 * @param {string} field Field label for diagnostics
 * @param {string[]} issues Mutable issue list
 * @returns {void}
 */
function requireString(value, field, issues) {
    if (typeof value !== "string" || !value.trim()) {
        issues.push(`${field} must be a non-empty string`);
    }
}

/**
 * Tests whether a value is a non-array object.
 *
 * @param {unknown} value Candidate value
 * @returns {boolean} Whether the value is a record
 */
function isRecord(value) {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
