export default {
    title: "Users",
    name: "user",
    type: "document",
    fields: [
        {
            title: "User info",
            name: "userInfo",
            type: "object",
            fields : [
                {
                    title : "Name",
                    name : "name",
                    type : "string",
                },
                {
                    title : "Last name",
                    name : "lastname",
                    type : "string",
                },
                {
                    title: "Email",
                    name : "email",
                    type : "string",
                },
                {
                    title: "Hash password",
                    name : "hashPassword",
                    type : "string",
                }
            ]
        },
        {
            title: "Role",
            name: "role",
            type: "string",
            options: {
                list: [
                    {title: "Admin", value: "e46w4=p[?5^|9hcycqGbR>R2oGl0oXLDrO£)r8!^+PT3xi:{0"},
                    {title: "User", value: "user"},
                ],
            },
        },
        {
            title: "sessionToken",
            name: "sessionToken",
            type: "string",
        },
    ],
}