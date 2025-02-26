export const bucket = new sst.aws.Bucket("MyBucket", {});

export const table = new sst.aws.Dynamo("TestTable", {
    fields: {
        id: "number",
        uploaded_by: "string",
        test_type: "string",
        organization_id: "number",
        generated_date: "string",
    },
    primaryIndex: { hashKey: "id" },
    ttl: "deleted_at",
    
    // Global secondary indexes for searching
    globalIndexes: {
        UploadedByIndex: {
            hashKey: "uploaded_by",
        },
        TestTypeIndex: {
            hashKey: "test_type",
        },
        OrganizationIdIndex: {
            hashKey: "organization_id",
        },

        // Composite indexes with date ranges
        OrganizationDateIndex: {
            hashKey: "organization_id",
            rangeKey: "generated_date",
        },
        UploadedByDateIndex: {
            hashKey: "uploaded_by",
            rangeKey: "generated_date",
        },
        TestTypeDateIndex: {
            hashKey: "test_type",
            rangeKey: "generated_date",
        }
    },
});