import { redis } from './redis';
import { Paste } from '../types/paste';
import { getCurrentTime } from './time';

export async function getPaste(id: string): Promise<Paste | null> {
  const now = await getCurrentTime();

  // LUA SCRIPT EXPLANATION:
  // 1. Get the JSON from Redis.
  // 2. If it doesn't exist, return nil.
  // 3. Decode JSON.
  // 4. Check if it's expired (TTL). If yes, return nil.
  // 5. Check View Limit. If remaining_views <= 0, return nil.
  // 6. If limits exist, decrement remaining_views and save back to Redis.
  // 7. Return the (possibly updated) JSON.
  
  const script = `
    local data = redis.call("GET", KEYS[1])
    if not data then return nil end
    
    local json = cjson.decode(data)
    
    -- Check Expiry (ARGV[1] is current time)
    if json.expires_at and json.expires_at < tonumber(ARGV[1]) then
      return nil
    end

    -- Check View Counts
    if json.max_views then
      if json.remaining_views and json.remaining_views <= 0 then
        return nil
      end
      -- Decrement
      json.remaining_views = json.remaining_views - 1
      -- Save updated version
      redis.call("SET", KEYS[1], cjson.encode(json))
    end

    return cjson.encode(json)
  `;

  try {
    // Run the script atomically
    const result = await redis.eval(script, [`paste:${id}`], [now]);
    
    if (!result) return null;

    // redis.eval might return the object directly or a string depending on the driver version
    // Safely handle both
    const paste = (typeof result === 'string') ? JSON.parse(result) : result;
    return paste as Paste;

  } catch (error) {
    console.error('Error fetching paste:', error);
    return null;
  }
}