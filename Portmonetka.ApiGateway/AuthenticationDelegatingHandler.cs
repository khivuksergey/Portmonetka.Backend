namespace Portmonetka.ApiGateway
{
    public class AuthenticationDelegatingHandler : DelegatingHandler
    {
        protected override async Task<HttpResponseMessage> SendAsync(
            HttpRequestMessage request,
            CancellationToken cancellationToken)
        {
            // Retrieve the JWT token from the incoming request headers (Authorization header)
            if (request.Headers.Authorization != null)
            {
                var token = request.Headers.Authorization.Parameter;
                // Attach the token to the downstream request
                request.Headers.Add("Authorization", $"Bearer {token}");
            }

            return await base.SendAsync(request, cancellationToken);
        }
    }
}
